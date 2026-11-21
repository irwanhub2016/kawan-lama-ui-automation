import type { Page } from '@playwright/test';
import { BasePage } from './BasePage.js';

export class HomePage extends BasePage {
  readonly makeAppointmentLink = this.page.getByRole('link', {
    name: 'Make Appointment',
    exact: true,
  });
  private readonly menuToggle = this.page.locator('#menu-toggle');
  private readonly logoutLink = this.page.getByRole('link', {
    name: 'Logout',
    exact: true,
  });

  constructor(page: Page) {
    super(page);
  }

  async openMakeAppointment(): Promise<void> {
    await this.makeAppointmentLink.click();
  }

  async logout(): Promise<void> {
    await this.menuToggle.click();
    await this.logoutLink.click();
  }
}
