# Test Coverage Mapping

The automated UI expectations below use the confirmed business rule that past visit dates must be rejected. Past-date coverage is therefore a negative test and should fail if the CURA demo currently accepts the date.

| Source scenario | Automation | Coverage / expected result |
|---|---|---|
| Login with valid credentials | `tests/auth/login-logout.spec.ts` — `logs in with the demo account` | Login succeeds and the Make Appointment form appears. |
| Login with invalid username | `tests/auth/login-logout.spec.ts` — generated from `invalidLoginScenarios` | Login is rejected; Login remains visible. |
| Login with invalid password | `tests/auth/login-logout.spec.ts` — generated from `invalidLoginScenarios` | Login is rejected; Login remains visible. |
| Login with empty username and password | `tests/auth/login-logout.spec.ts` — generated from `invalidLoginScenarios` | Login is rejected; Login remains visible. |
| Logout | `tests/auth/login-logout.spec.ts` — `logs out and requires login before another appointment can be made` | Logout returns to the public page and a new appointment attempt requires login. |
| Make an appointment with valid inputs | `tests/appointment/appointment.spec.ts` — `books an appointment with valid details` | Confirmation matches facility, program, future date, readmission, and comment. |
| Make an appointment with None program and no comment | `tests/appointment/appointment.spec.ts` — `books an appointment with no program and no comment` | Confirmation reflects the selected facility/program, date, unchecked readmission, and blank comment. |
| Missing Facility | `tests/appointment/appointment.spec.ts` — `shows that the UI preselects a facility and offers no empty facility choice` | UI behavior covered: Tokyo is selected by default and there is no blank option, so a missing-facility state cannot be submitted through the normal UI. |
| Missing Visit Date | `tests/appointment/appointment.spec.ts` — `prevents submission when Visit Date is missing` | Native `required` validation keeps the appointment form open and marks the empty date invalid. |
| Invalid Visit Date (Past Date) | `tests/appointment/appointment.spec.ts` — `rejects a past visit date` | Past date `01/01/2020` must be rejected; the appointment form must remain visible and Appointment Confirmation must not appear. The current demo is expected to fail this test because it accepts past dates. |

## Known server-side gap

Separate direct HTTP probes showed the server accepts a missing facility, a missing visit date, and a past visit date when those values are submitted outside the browser. The browser suite intentionally does not assert server-side validation because the requested coverage is for current UI behavior and these probes are not browser UI flows. If server-side validation becomes a requirement, add API-level tests and change the expected result to rejection; do not treat the current acceptance as desirable validation behavior.
