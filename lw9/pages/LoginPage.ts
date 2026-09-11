import { type Locator, type Page } from '@playwright/test';

export class LoginPage {
  constructor(private readonly page: Page) {}

  loginInput(): Locator {
    return this.page.locator('form#login [name="login"]');
  }

  passwordInput(): Locator {
    return this.page.locator('form#login [name="password"]');
  }

  submitButton(): Locator {
    return this.page.locator('form#login button[type="submit"]');
  }

  successAlert(): Locator {
    return this.page.locator('.alert.alert-success');
  }

  async login(login: string, password: string): Promise<void> {
    await this.loginInput().fill(login);
    await this.passwordInput().fill(password);
    await this.submitButton().click();
  }
}
