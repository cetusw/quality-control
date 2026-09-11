import { type Locator, type Page } from '@playwright/test';

export class MainPage {
  constructor(protected readonly page: Page) {}

  async open(): Promise<void> {
    await this.page.goto('./');
  }

  accountMenu(): Locator {
    return this.page.locator('.btn-group').filter({ has: this.page.locator('a.dropdown-toggle') });
  }

  loginLink(): Locator {
    return this.page.locator('a[href="user/login"]');
  }

  cartLink(): Locator {
    return this.page.locator('a[href="cart/show"]');
  }

  cartModal(): Locator {
    return this.page.locator('#cart');
  }

  async openLogin(): Promise<void> {
    await this.accountMenu().locator('.dropdown-toggle').click();
    await this.loginLink().click();
  }

  async openCart(): Promise<void> {
    await this.cartLink().click();
  }
}
