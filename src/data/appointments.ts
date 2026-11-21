import type { AppointmentTestData } from '../types/testTypes.js';

export const defaultFacility = 'Tokyo CURA Healthcare Center';
export const pastVisitDate = '01/01/2020';

export function formatVisitDate(date: Date): string {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${day}/${month}/${date.getFullYear()}`;
}

export function getFutureVisitDate(daysAhead = 7): string {
  const date = new Date();
  date.setDate(date.getDate() + daysAhead);
  return formatVisitDate(date);
}

export function createAppointmentData(
  overrides: Partial<AppointmentTestData> = {},
): AppointmentTestData {
  return {
    facility: defaultFacility,
    program: 'Medicare',
    visitDate: getFutureVisitDate(),
    comment: 'Routine check-up',
    applyForReadmission: true,
    ...overrides,
  };
}
