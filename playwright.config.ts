import 'dotenv/config';

import { defineConfig, devices } from '@playwright/test';

const isCI = Boolean(process.env.CI);
const baseURL =
  process.env.BASE_URL ?? 'https://katalon-demo-cura.herokuapp.com';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  workers: isCI ? 2 : undefined,
  timeout: 30_000,
  expect: {
    timeout: 10_000,
  },
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
  ],
  outputDir: 'test-results',
  use: {
    ...devices['Desktop Chrome'],
    browserName: 'chromium',
    baseURL,
    headless: process.env.HEADLESS !== 'false',
    screenshot: 'only-on-failure',
    trace: 'on-first-retry',
    actionTimeout: 10_000,
    navigationTimeout: 15_000,
  },
});
