import { expect, test } from '@playwright/test';
import data from '../test-data/test-data.json';
import { CartPage } from '../pages/CartPage';
import { ProductPage } from '../pages/ProductPage';

test('Товар добавляется в корзину в указанном количестве', async ({ page }) => {
  const productPage = new ProductPage(page);
  const cartPage = new CartPage(page);

  await productPage.openBySlug(data.cart.productSlug);
  await productPage.addToCart();

  await expect(cartPage.modal()).toBeVisible();
  await expect(cartPage.itemByName(data.cart.productName)).toBeVisible();
  await expect(cartPage.totalQuantity()).toHaveText(String(data.cart.expectedQuantity));
});
