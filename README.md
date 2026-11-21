# CURA Playwright UI Automation

A TypeScript and Playwright Test framework for functional UI coverage of login/logout and appointment booking on the public [CURA Healthcare Service demo](https://katalon-demo-cura.herokuapp.com).

## Technology

- Node.js 24
- Playwright Test (Chromium)
- TypeScript
- Page Object Model and typed Playwright fixtures
- GitHub Actions

## Project layout

```text
.github/workflows/playwright.yml
src/
  data/             # Credentials and appointment scenario data
  fixtures/         # Shared page-object and authenticated-page fixtures
  pages/            # Page objects; locators and interactions stay here
  types/            # Typed credentials, appointments, and scenario data
tests/
  auth/             # Login and logout cases
  appointment/      # Appointment creation and validation cases
playwright.config.ts
test-coverage.md    # Source-to-automation coverage map and known gaps
```

Each test gets an isolated Playwright browser context. Appointment tests use a fixture that logs in independently, so scenarios can run in parallel without sharing session state. Page objects own the selectors and interactions; tests own assertions.

## Requirements and installation

Install Node.js 24 and npm, then from the repository root:

```bash
npm ci
npx playwright install chromium
cp .env.example .env
```

For Linux CI or a fresh Linux machine, install browser OS dependencies as well:

```bash
npx playwright install --with-deps chromium
```

The framework uses the public demo account shown on the site's login page by default. Override it in `.env` for another compatible environment:

```dotenv
BASE_URL=https://katalon-demo-cura.herokuapp.com
CURA_USERNAME=John Doe
CURA_PASSWORD=ThisIsNotAPassword
HEADLESS=true
```

`.env` is ignored by Git. Do not put private credentials in tracked files. `BASE_URL` can point at a development or staging environment that implements the same workflow. Set `HEADLESS=false` for local headed runs.

## Run tests

Run the complete suite:

```bash
npm test
```

Run a feature file or a test by title:

```bash
npx playwright test tests/auth/login-logout.spec.ts
npx playwright test tests/appointment/appointment.spec.ts
npx playwright test -g "past visit date"
```

Run with a visible Chromium window:

```bash
npm run test:headed
```

Run Playwright's interactive test UI:

```bash
npm run test:ui
```

Check TypeScript types:

```bash
npm run test:types
```

## Reports and debugging

Playwright writes its HTML report to `playwright-report/` and attachments (including failure screenshots and retry traces) to `test-results/`.

```bash
npm run report
```

The report opens locally in a browser. For failures, inspect the test's screenshot and trace in `test-results/`; the trace can be opened with:

```bash
npx playwright show-trace test-results/<test-folder>/trace.zip
```

Traces are collected on the first retry, screenshots on failure, and CI retries failed tests twice. No fixed sleeps are used; interactions and assertions rely on Playwright auto-waiting.

## GitHub Actions

`.github/workflows/playwright.yml` runs on pushes, pull requests, and manual `workflow_dispatch`. It installs Node.js from `.nvmrc`, runs `npm ci`, installs Chromium plus OS dependencies, executes the suite, and uploads `playwright-report/` and `test-results/` even if tests fail.

The public demo credentials are defaults. For a private environment, set repository secrets `CURA_USERNAME` and `CURA_PASSWORD`, and optionally the repository variable `CURA_BASE_URL`. Workflow permissions are read-only for repository contents.

## Add a page object

1. Add a class under `src/pages/` extending `BasePage`.
2. Keep the page's locators private or readonly in that class.
3. Add reusable user interactions as typed async methods.
4. Expose the object through `src/fixtures/testFixtures.ts` if multiple tests need it.
5. Keep expected-result assertions in the test spec.

## Add or update a scenario

1. Add or update typed test data under `src/data/`; do not embed mutable scenario data in a spec.
2. Add a descriptive test under the matching `tests/` feature directory.
3. Use page-object methods and web-first `expect` assertions.
4. Update `test-coverage.md` with the source scenario, test title, and expected outcome.
5. Run the focused spec, then `npm test` and `npm run test:types`.

Appointment data is created per test by `createAppointmentData()`. Use its overrides to make a new scenario without mutating shared defaults. The demo credentials are environment-overridable; use GitHub secrets rather than committing private credentials.

## Application behavior and scope

The browser tests are based on observed current UI behavior:

- The Facility select defaults to Tokyo CURA Healthcare Center and does not expose a blank option.
- Visit Date is marked `required`; an empty date is blocked by browser-native validation.
- Past visit dates must be rejected. The negative test is expected to fail until the demo or target environment adds past-date validation.

Separate direct HTTP probing found server acceptance for missing facility, missing date, and past date. That is a known server-side validation gap and is documented in [test-coverage.md](./test-coverage.md); it is deliberately not represented as a browser UI scenario. If the product requirement changes to reject those requests, add API tests and update the characterization assertion to the required result.
