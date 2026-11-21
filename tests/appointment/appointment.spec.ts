import { test, expect } from '../../src/fixtures/testFixtures.js';
import {
  createAppointmentData,
  defaultFacility,
  pastVisitDate,
} from '../../src/data/appointments.js';

test.describe('Make Appointment', () => {
  test('books an appointment with valid details', async ({
    authenticatedAppointmentPage,
    confirmationPage,
  }) => {
    const appointment = createAppointmentData();
    await authenticatedAppointmentPage.fillAppointment(appointment);
    await expect(authenticatedAppointmentPage.visitDateInput).toHaveValue(
      appointment.visitDate,
    );
    await authenticatedAppointmentPage.bookAppointment();

    await expect(confirmationPage.heading).toBeVisible();
    await expect(confirmationPage.facility).toHaveText(appointment.facility);
    await expect(confirmationPage.program).toHaveText(appointment.program);
    await expect(confirmationPage.visitDate).toHaveText(appointment.visitDate);
    await expect(confirmationPage.readmission).toHaveText('Yes');
    await expect(confirmationPage.comment).toHaveText(appointment.comment);
  });

  test('books an appointment with no program and no comment', async ({
    authenticatedAppointmentPage,
    confirmationPage,
  }) => {
    const appointment = createAppointmentData({
      facility: 'Seoul CURA Healthcare Center',
      program: 'None',
      comment: '',
      applyForReadmission: false,
    });
    await authenticatedAppointmentPage.fillAppointment(appointment);
    await authenticatedAppointmentPage.bookAppointment();

    await expect(confirmationPage.heading).toBeVisible();
    await expect(confirmationPage.facility).toHaveText(appointment.facility);
    await expect(confirmationPage.program).toHaveText(appointment.program);
    await expect(confirmationPage.visitDate).toHaveText(appointment.visitDate);
    await expect(confirmationPage.readmission).toHaveText('No');
    await expect(confirmationPage.comment).toBeEmpty();
  });

  test('shows that the UI preselects a facility and offers no empty facility choice', async ({
    authenticatedAppointmentPage,
  }) => {
    await expect(authenticatedAppointmentPage.facilitySelect).toHaveValue(
      defaultFacility,
    );
    expect(await authenticatedAppointmentPage.getFacilityOptions()).toHaveLength(3);
    expect(await authenticatedAppointmentPage.hasEmptyFacilityOption()).toBe(false);
  });

  test('prevents submission when Visit Date is missing', async ({
    authenticatedAppointmentPage,
  }) => {
    await authenticatedAppointmentPage.fillAppointmentDetails(
      createAppointmentData(),
    );
    await expect(authenticatedAppointmentPage.visitDateInput).toHaveAttribute(
      'required',
      '',
    );
    await authenticatedAppointmentPage.bookAppointment();

    await expect(authenticatedAppointmentPage.heading).toBeVisible();
    expect(
      await authenticatedAppointmentPage.visitDateIsMissingAndInvalid(),
    ).toBe(true);
  });

  test('rejects a past visit date', async ({
    authenticatedAppointmentPage,
    confirmationPage,
  }) => {
    test.info().annotations.push({
      type: 'business-rule',
      description:
        'A past visit date must not be accepted for a new appointment.',
    });
    const appointment = createAppointmentData({ visitDate: pastVisitDate });
    await authenticatedAppointmentPage.fillAppointment(appointment);
    await expect(authenticatedAppointmentPage.visitDateInput).toHaveValue(
      pastVisitDate,
    );
    await authenticatedAppointmentPage.bookAppointment();

    await expect(confirmationPage.heading).toBeHidden();
  });
});
