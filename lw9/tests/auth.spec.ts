import { expect, test } from '@playwright/test';
import data from '../test-data/test-data.json';
import { LoginPage } from '../pages/LoginPage';
import { MainPage } from '../pages/MainPage';

test('Пользователь успешно авторизуется с корректными данными', async ({ page }) => {
  const mainPage = new MainPage(page);
  const loginPage = new LoginPage(page);

  await mainPage.open();
  await mainPage.openLogin();
  await loginPage.login(data.auth.login, data.auth.password);

  await expect(loginPage.successAlert()).toContainText(data.auth.successMessage);
});
