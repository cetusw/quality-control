import { type Locator, type Page } from '@playwright/test';

export class CatalogPage {
  constructor(private readonly page: Page) {}

  searchInput(): Locator {
    return this.page.locator('#typeahead');
  }

  productByName(name: string): Locator {
    return this.page.getByRole('heading', { name, exact: true }).first();
  }

  async open(): Promise<void> {
    await this.page.goto('./');
  }

  async search(query: string): Promise<void> {
    await this.searchInput().fill(query);
    await this.searchInput().press('Enter');
  }
}
