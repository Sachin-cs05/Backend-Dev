# Financial Security Assignment

This folder contains a production-oriented Node/Express reference implementation that addresses all 10 requested security problems for a financial application.

## Structure

- `src/`: application code for authentication, transaction protection, account security, middleware, validators, and production security configuration.
- `tests/`: automated security-focused regression tests.
- `problems/`: problem-wise documentation with names matching each assignment requirement.

## Notes

- Session cookies are configured as `Secure`, `HttpOnly`, `SameSite=Strict`, and stored with encrypted `MongoStore`.
- HTTPS enforcement, Helmet, strict CSP, and rate limiting are enabled in the app bootstrap.
- Step-up authentication supports either `2FA` or a mobile `biometricAssertion` for high-value transactions.
- Logging is implemented as an auditable service abstraction and can be connected to a SIEM or persistent store in production.
