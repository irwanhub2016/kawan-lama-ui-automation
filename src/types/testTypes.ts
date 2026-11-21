export type HealthcareProgram = 'Medicare' | 'Medicaid' | 'None';

export interface Credentials {
  readonly username: string;
  readonly password: string;
}

export interface AppointmentTestData {
  readonly facility: string;
  readonly program: HealthcareProgram;
  readonly visitDate: string;
  readonly comment: string;
  readonly applyForReadmission: boolean;
}

export interface InvalidLoginScenario {
  readonly name: string;
  readonly credentials: Credentials;
}
