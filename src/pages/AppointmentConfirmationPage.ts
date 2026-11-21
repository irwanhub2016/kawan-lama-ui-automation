import type { Page } from '@playwright/test';
import { BasePage } from './BasePage.js';

export class AppointmentConfirmationPage extends BasePage {
  readonly heading = this.page.getByRole('heading', {
    name: 'Appointment Confirmation',
    exact: true,
  });
  readonly facility = this.page.locator('#facility');
  readonly readmission = this.page.locator('#hospital_readmission');
  readonly program = this.page.locator('#program');
  readonly visitDate = this.page.locator('#visit_date');
  readonly comment = this.page.locator('#comment');

  constructor(page: Page) {
    super(page);
  }
}
