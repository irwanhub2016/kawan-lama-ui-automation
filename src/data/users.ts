import type { Credentials } from '../types/testTypes.js';

export const demoUser: Credentials = Object.freeze({
  username: process.env.CURA_USERNAME ?? 'John Doe',
  password: process.env.CURA_PASSWORD ?? 'ThisIsNotAPassword',
});

export const invalidLoginScenarios = [
  {
    name: 'rejects an invalid username',
    credentials: {
      username: 'invalid-user',
      password: demoUser.password,
    },
  },
  {
    name: 'rejects an invalid password',
    credentials: {
      username: demoUser.username,
      password: 'invalid-password',
    },
  },
  {
    name: 'rejects empty credentials',
    credentials: {
      username: '',
      password: '',
    },
  },
] as const;
