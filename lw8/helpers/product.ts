import { expect, type APIRequestContext } from '@playwright/test';
import expected from '../data/expected.json';

const API_TIMEOUT = 60_000;

export interface Product {
  id?: string | number;
  category_id: string | number;
  title: string;
  alias?: string;
  content: string | null;
  price: string | number;
  old_price: string | number;
  status: string | number;
  keywords: string | null;
  description: string | null;
  hit: string | number;
  img?: string;
  cat?: string;
}

export type ProductInput = Omit<Product, 'id' | 'alias' | 'img' | 'cat'>;

interface AddProductResponse {
  status?: number;
  id?: string | number;
}

interface StatusResponse {
  status?: number;
}

export async function readProducts(request: APIRequestContext): Promise<Product[]> {
  const response = await request.get('api/products', { timeout: API_TIMEOUT });

  expect(response.ok(), `GET /api/products вернул HTTP ${response.status()}`).toBeTruthy();
  expect(
    response.headers()['content-type'],
    'GET /api/products должен вернуть JSON'
  ).toContain(expected.productsContentType);

  let body: unknown;

  try {
    body = await response.json();
  } catch {
    throw new Error('GET /api/products вернул тело, которое невозможно разобрать как JSON');
  }

  expect(Array.isArray(body), 'Тело GET /api/products должно быть массивом товаров').toBeTruthy();

  return body as Product[];
}

export async function createProduct(
  request: APIRequestContext,
  product: ProductInput
): Promise<string> {
  const response = await request.post('api/addproduct', {
    data: product,
    timeout: API_TIMEOUT,
  });
  const body = (await response.json()) as AddProductResponse;

  expect(response.ok(), `POST /api/addproduct вернул HTTP ${response.status()}`).toBeTruthy();
  expect(
    body.status,
    `Добавление товара "${product.title}" не вернуло status: ${expected.successStatus}`
  ).toBe(expected.successStatus);
  expect(body.id, `Добавление товара "${product.title}" не вернуло id`).toBeDefined();

  return String(body.id);
}

export async function editProduct(
  request: APIRequestContext,
  product: ProductInput & { id: string }
): Promise<void> {
  const response = await request.post('api/editproduct', {
    data: product,
    timeout: API_TIMEOUT,
  });
  const body = (await response.json()) as StatusResponse;

  expect(response.ok(), `POST /api/editproduct вернул HTTP ${response.status()}`).toBeTruthy();
  expect(
    body.status,
    `Редактирование товара ID=${product.id} не вернуло status: ${expected.successStatus}`
  ).toBe(expected.successStatus);
}

export async function deleteProduct(request: APIRequestContext, id: string): Promise<void> {
  const response = await request.get(`api/deleteproduct?id=${encodeURIComponent(id)}`, {
    timeout: API_TIMEOUT,
  });
  const body = (await response.json()) as StatusResponse;

  expect(
    response.ok(),
    `GET /api/deleteproduct?id=${id} вернул HTTP ${response.status()}`
  ).toBeTruthy();
  expect(
    body.status,
    `Удаление товара ID=${id} не вернуло status: ${expected.successStatus}`
  ).toBe(expected.successStatus);
}

export function findProduct(products: Product[], id: string): Product | undefined {
  return products.find((product) => String(product.id) === id);
}

export function checkProduct(actual: Product, expectedProduct: ProductInput): void {
  const fields: Array<keyof ProductInput> = [
    'category_id',
    'title',
    'content',
    'price',
    'old_price',
    'status',
    'keywords',
    'description',
    'hit',
  ];

  for (const field of fields) {
    const actualValue = actual[field];
    const expectedValue = expectedProduct[field];

    expect(
      String(actualValue),
      `Некорректное поле ${field}. Ожидалось: ${String(expectedValue)}, получено: ${String(actualValue)}`
    ).toBe(String(expectedValue));
  }
}
