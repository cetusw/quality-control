import { expect, test } from '@playwright/test';
import data from '../test-data/test-data.json';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { LoginPage } from '../pages/LoginPage';
import { MainPage } from '../pages/MainPage';
import { ProductPage } from '../pages/ProductPage';

test('Пользователь успешно оформляет заказ', async ({ page }) => {
  const productPage = new ProductPage(page);
  const cartPage = new CartPage(page);
  const checkoutPage = new CheckoutPage(page);
  const mainPage = new MainPage(page);
  const loginPage = new LoginPage(page);

  await mainPage.open();
  await mainPage.openLogin();
  await loginPage.login(data.auth.login, data.auth.password);
  await expect(loginPage.successAlert()).toContainText(data.auth.successMessage);
  await productPage.openBySlug(data.cart.productSlug);
  await productPage.addToCart();
  await expect(cartPage.modal()).toBeVisible();
  await cartPage.openCheckout();
  await checkoutPage.fillOrderNote(data.checkout.note);
  await checkoutPage.submit();

  await expect(checkoutPage.successAlert()).toContainText(data.checkout.successMessage);
});
