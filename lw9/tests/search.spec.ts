import { expect, test } from '@playwright/test';
import data from '../test-data/test-data.json';
import { CatalogPage } from '../pages/CatalogPage';

test('Товар можно найти через поиск', async ({ page }) => {
  const catalogPage = new CatalogPage(page);

  await catalogPage.open();
  await catalogPage.search(data.product.searchQuery);

  await expect(catalogPage.productByName(data.product.expectedName)).toBeVisible();
});
