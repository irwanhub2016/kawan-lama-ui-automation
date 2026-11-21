import type { Page } from '@playwright/test';
import type { AppointmentTestData } from '../types/testTypes.js';
import { BasePage } from './BasePage.js';

export class AppointmentPage extends BasePage {
  readonly heading = this.page.getByRole('heading', {
    name: 'Make Appointment',
    exact: true,
  });
  readonly facilitySelect = this.page.getByLabel('Facility', { exact: true });
  readonly visitDateInput = this.page.getByLabel('Visit Date (Required)', {
    exact: true,
  });
  private readonly commentInput = this.page.getByLabel('Comment', {
    exact: true,
  });
  private readonly readmissionCheckbox = this.page.getByLabel(
    'Apply for hospital readmission',
    { exact: true },
  );
  private readonly bookAppointmentButton = this.page.getByRole('button', {
    name: 'Book Appointment',
    exact: true,
  });
  private readonly datepickerHeader = this.page.locator(
    '.datepicker-days th.datepicker-switch',
  );
  private readonly previousMonthButton = this.page.locator(
    '.datepicker-days th.prev',
  );
  private readonly nextMonthButton = this.page.locator(
    '.datepicker-days th.next',
  );
  private readonly selectableCalendarDays = this.page.locator(
    '.datepicker-days td.day:not(.old):not(.new)',
  );

  constructor(page: Page) {
    super(page);
  }

  async fillAppointment(data: AppointmentTestData): Promise<void> {
    await this.fillAppointmentDetails(data);
    await this.selectVisitDate(data.visitDate);
  }

  async fillAppointmentDetails(data: AppointmentTestData): Promise<void> {
    await this.facilitySelect.selectOption(data.facility);
    await this.page.getByRole('radio', { name: data.program }).check();
    if (data.applyForReadmission) {
      await this.readmissionCheckbox.check();
    } else {
      await this.readmissionCheckbox.uncheck();
    }
    await this.commentInput.fill(data.comment);
  }

  async selectVisitDate(visitDate: string): Promise<void> {
    const [day, month, year] = visitDate.split('/').map(Number);
    if (!day || !month || !year || month > 12 || day > 31) {
      throw new Error(`Visit date must use dd/mm/yyyy format: ${visitDate}`);
    }

    const targetMonth = new Date(year, month - 1, 1).toLocaleString('en-US', {
      month: 'long',
    });
    const targetHeader = `${targetMonth} ${year}`;
    await this.visitDateInput.click();

    for (let attempt = 0; attempt < 120; attempt += 1) {
      const currentHeader = await this.datepickerHeader.innerText();
      if (currentHeader === targetHeader) {
        const dayCell = this.selectableCalendarDays.filter({
          hasText: new RegExp(`^${day}$`),
        });
        await dayCell.click();
        return;
      }

      const currentDate = new Date(`${currentHeader} 1`);
      const targetDate = new Date(year, month - 1, 1);
      if (currentDate > targetDate) {
        await this.previousMonthButton.click();
      } else {
        await this.nextMonthButton.click();
      }
    }

    throw new Error(`Could not navigate the datepicker to ${targetHeader}`);
  }

  async bookAppointment(): Promise<void> {
    await this.bookAppointmentButton.click();
  }

  async getFacilityOptions(): Promise<string[]> {
    return this.facilitySelect.locator('option').allTextContents();
  }

  async hasEmptyFacilityOption(): Promise<boolean> {
    return (await this.facilitySelect.locator('option[value=""]').count()) > 0;
  }

  async visitDateIsMissingAndInvalid(): Promise<boolean> {
    return this.visitDateInput.evaluate((element) => {
      const input = element as HTMLInputElement;
      return input.required && input.value === '' && input.validity.valueMissing;
    });
  }
}
