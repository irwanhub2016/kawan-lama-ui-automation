import type { Page } from '@playwright/test';
import type { Credentials } from '../types/testTypes.js';
import { BasePage } from './BasePage.js';

export class LoginPage extends BasePage {
  readonly heading = this.page.getByRole('heading', {
    name: 'Login',
    exact: true,
  });
  private readonly usernameInput = this.page.getByLabel('Username', {
    exact: true,
  });
  private readonly passwordInput = this.page.getByLabel('Password', {
    exact: true,
  });
  readonly loginButton = this.page.getByRole('button', {
    name: 'Login',
    exact: true,
  });

  constructor(page: Page) {
    super(page);
  }

  async login(credentials: Credentials): Promise<void> {
    await this.usernameInput.fill(credentials.username);
    await this.passwordInput.fill(credentials.password);
    await this.loginButton.click();
  }
}
