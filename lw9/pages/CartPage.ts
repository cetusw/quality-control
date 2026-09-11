import { type Locator, type Page } from '@playwright/test';

export class CartPage {
  constructor(private readonly page: Page) {}

  modal(): Locator {
    return this.page.locator('#cart');
  }

  itemByName(name: string): Locator {
    return this.modal().locator('td').filter({ hasText: name });
  }

  totalQuantity(): Locator {
    return this.modal().locator('.cart-qty');
  }

  checkoutLink(): Locator {
    return this.modal().locator('a[href="cart/view"]');
  }

  async openCheckout(): Promise<void> {
    await this.checkoutLink().click();
  }
}
