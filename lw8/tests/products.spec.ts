import { test, expect, type APIRequestContext, type TestInfo } from '@playwright/test';
import expected from '../data/expected.json';
import products from '../data/products.json';
import {
  checkProduct,
  createProduct,
  deleteProduct,
  editProduct,
  findProduct,
  readProducts,
  type ProductInput,
} from '../helpers/product';

const createdIdsByTest = new Map<string, string[]>();

function uniqueProduct(source: ProductInput, suffix: string): ProductInput {
  return {
    ...source,
    title: `${source.title}_${suffix}`,
  };
}

async function createTrackedProduct(
  request: APIRequestContext,
  testInfo: TestInfo,
  product: ProductInput
): Promise<string> {
  const id = await createProduct(request, product);
  createdIdsByTest.get(testInfo.testId)?.push(id);

  return id;
}

test.beforeEach(async ({}, testInfo) => {
  createdIdsByTest.set(testInfo.testId, []);
});

test.afterEach(async ({ request }, testInfo) => {
  const createdIds = createdIdsByTest.get(testInfo.testId) ?? [];

  for (const id of createdIds) {
    try {
      const productsAfterTest = await readProducts(request);

      if (findProduct(productsAfterTest, id)) {
        await deleteProduct(request, id);
      }
    } catch (error) {
      console.warn(`Не удалось очистить тестовый товар ID=${id}: ${String(error)}`);
    }
  }

  createdIdsByTest.delete(testInfo.testId);
});

test.describe('API товаров интернет-магазина', () => {
  test('Получение списка товаров возвращает пригодный для поиска массив', async ({ request }) => {
    const productList = await readProducts(request);
    const firstProduct = productList[0];

    expect(
      productList.length,
      'Список товаров не должен быть пустым для проверки структуры'
    ).toBeGreaterThan(0);
    expect(firstProduct.id, 'У товара из списка отсутствует id').toBeDefined();
    expect(firstProduct.title, 'У товара из списка отсутствует title').toBeTruthy();
    expect(
      findProduct(productList, String(firstProduct.id)),
      `Товар ID=${String(firstProduct.id)} должен находиться поиском в полученном списке`
    ).toBeDefined();
  });

  test('Добавление товара сохраняет все поля', async ({ request }, testInfo) => {
    const product = uniqueProduct(products.validProduct, `${testInfo.parallelIndex}_${Date.now()}`);
    const id = await createTrackedProduct(request, testInfo, product);

    const actualProduct = findProduct(await readProducts(request), id);

    expect(
      actualProduct,
      `После добавления товар "${product.title}" с ID=${id} не найден в GET /api/products`
    ).toBeDefined();
    checkProduct(actualProduct!, product);
    expect(actualProduct!.alias, `У созданного товара ID=${id} отсутствует alias`).toBeTruthy();
    expect(
      actualProduct!.alias,
      'Alias для латинского QA-названия должен совпадать с title в нижнем регистре'
    ).toBe(product.title.toLowerCase());
  });

  test('Два товара с одинаковым title получают разные alias', async ({ request }, testInfo) => {
    const product = uniqueProduct(
      products.validProduct,
      `alias_${testInfo.parallelIndex}_${Date.now()}`
    );
    const firstId = await createTrackedProduct(request, testInfo, product);
    const secondId = await createTrackedProduct(request, testInfo, product);

    const productList = await readProducts(request);
    const firstProduct = findProduct(productList, firstId);
    const secondProduct = findProduct(productList, secondId);

    expect(firstProduct, `Первый товар ID=${firstId} не найден`).toBeDefined();
    expect(secondProduct, `Второй товар ID=${secondId} не найден`).toBeDefined();
    expect(secondId, 'ID товаров с одинаковым title должны различаться').not.toBe(firstId);
    expect(
      secondProduct!.alias,
      `Alias второго товара не должен совпадать с alias первого (${firstProduct!.alias})`
    ).not.toBe(firstProduct!.alias);
    expect(
      secondProduct!.alias,
      `Alias второго товара должен быть "${firstProduct!.alias}${expected.duplicateAliasSuffix}" согласно требованию лабораторной`
    ).toBe(`${firstProduct!.alias}${expected.duplicateAliasSuffix}`);
  });

  test('Редактирование товара изменяет поля, доступные через список, и сохраняет ID', async ({ request }, testInfo) => {
    const initialProduct = uniqueProduct(
      products.validProduct,
      `edit_${testInfo.parallelIndex}_${Date.now()}`
    );
    const id = await createTrackedProduct(request, testInfo, initialProduct);
    const changedProduct = uniqueProduct(
      products.editedProduct,
      `edit_${testInfo.parallelIndex}_${Date.now()}`
    );

    await editProduct(request, { ...changedProduct, id });

    const actualProduct = findProduct(await readProducts(request), id);

    expect(actualProduct, `После редактирования товар ID=${id} не найден в GET /api/products`).toBeDefined();
    expect(
      String(actualProduct!.id),
      `ID изменился после редактирования. Ожидалось: ${id}, получено: ${String(actualProduct!.id)}`
    ).toBe(id);
    checkProduct(actualProduct!, changedProduct);
    expect(
      actualProduct!.title,
      `Старый title "${initialProduct.title}" не был заменён`
    ).not.toBe(initialProduct.title);
    expect(actualProduct!.alias, 'После изменения title сервер должен обновить alias').toBe(
      changedProduct.title.toLowerCase()
    );
  });

  test('Удалённый товар отсутствует в списке', async ({ request }, testInfo) => {
    const product = uniqueProduct(
      products.validProduct,
      `delete_${testInfo.parallelIndex}_${Date.now()}`
    );
    const id = await createTrackedProduct(request, testInfo, product);

    await deleteProduct(request, id);

    expect(
      findProduct(await readProducts(request), id),
      `После удаления товар с ID=${id} всё ещё присутствует в GET /api/products`
    ).toBeUndefined();
  });

  test('Граничные допустимые значения сохраняются корректно', async ({ request }, testInfo) => {
    const product = uniqueProduct(products.boundaryProduct, `${testInfo.parallelIndex}_${Date.now()}`);
    const id = await createTrackedProduct(request, testInfo, product);

    const actualProduct = findProduct(await readProducts(request), id);

    expect(actualProduct, `Граничный товар ID=${id} не найден после добавления`).toBeDefined();
    checkProduct(actualProduct!, product);
  });
});
