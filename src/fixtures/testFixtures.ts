import { expect, test as base } from '@playwright/test';
import { demoUser } from '../data/users.js';
import { AppointmentConfirmationPage } from '../pages/AppointmentConfirmationPage.js';
import { AppointmentPage } from '../pages/AppointmentPage.js';
import { HomePage } from '../pages/HomePage.js';
import { LoginPage } from '../pages/LoginPage.js';

interface CuraFixtures {
  homePage: HomePage;
  loginPage: LoginPage;
  appointmentPage: AppointmentPage;
  confirmationPage: AppointmentConfirmationPage;
  authenticatedAppointmentPage: AppointmentPage;
}

export const test = base.extend<CuraFixtures>({
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  appointmentPage: async ({ page }, use) => {
    await use(new AppointmentPage(page));
  },
  confirmationPage: async ({ page }, use) => {
    await use(new AppointmentConfirmationPage(page));
  },
  authenticatedAppointmentPage: async (
    { homePage, loginPage, appointmentPage },
    use,
  ) => {
    await homePage.goto('/');
    await homePage.openMakeAppointment();
    await loginPage.login(demoUser);
    await expect(appointmentPage.heading).toBeVisible();
    await use(appointmentPage);
  },
});

export { expect };
