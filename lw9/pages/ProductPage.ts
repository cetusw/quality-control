import { type Locator, type Page } from '@playwright/test';

export class ProductPage {
  constructor(private readonly page: Page) {}

  productTitle(): Locator {
    return this.page.locator('.single-para h2');
  }

  addToCartButton(): Locator {
    return this.page.locator('#productAdd');
  }

  cartModal(): Locator {
    return this.page.locator('#cart');
  }

  async openBySlug(productSlug: string): Promise<void> {
    await this.page.goto(`product/${productSlug}`);
  }

  async addToCart(): Promise<void> {
    await this.addToCartButton().click();
  }
}
