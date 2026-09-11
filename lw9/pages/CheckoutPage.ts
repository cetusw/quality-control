import { type Locator, type Page } from '@playwright/test';

export class CheckoutPage {
  constructor(private readonly page: Page) {}

  noteInput(): Locator { return this.page.locator('form[action="cart/checkout"] [name="note"]'); }
  submitButton(): Locator { return this.page.locator('form[action="cart/checkout"] button[type="submit"]'); }
  successAlert(): Locator { return this.page.locator('.alert.alert-success'); }

  async fillOrderNote(note: string): Promise<void> {
    await this.noteInput().fill(note);
  }

  async submit(): Promise<void> {
    await this.submitButton().click();
  }
}
