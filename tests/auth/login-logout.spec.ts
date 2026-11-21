import { test, expect } from '../../src/fixtures/testFixtures.js';
import { demoUser, invalidLoginScenarios } from '../../src/data/users.js';

test.describe('Login and logout', () => {
  test('logs in with the demo account', async ({ homePage, loginPage, appointmentPage }) => {
    await homePage.goto('/');
    await homePage.openMakeAppointment();
    await expect(loginPage.heading).toBeVisible();

    await loginPage.login(demoUser);

    await expect(appointmentPage.heading).toBeVisible();
  });

  for (const scenario of invalidLoginScenarios) {
    test(scenario.name, async ({ homePage, loginPage }) => {
      await homePage.goto('/');
      await homePage.openMakeAppointment();

      await loginPage.login(scenario.credentials);

      await expect(loginPage.heading).toBeVisible();
      await expect(loginPage.loginButton).toBeVisible();
    });
  }

  test('logs out and requires login before another appointment can be made', async ({
    homePage,
    loginPage,
  }) => {
    await homePage.goto('/');
    await homePage.openMakeAppointment();
    await loginPage.login(demoUser);

    await homePage.logout();
    await expect(homePage.makeAppointmentLink).toBeVisible();
    await homePage.openMakeAppointment();

    await expect(loginPage.heading).toBeVisible();
  });
});
