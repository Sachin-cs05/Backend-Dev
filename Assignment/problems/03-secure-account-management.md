# Problem 03: Secure Account Management

- Profile updates are validated with Joi and sanitized in `src/validators/account.validators.js` and `src/services/account.service.js`.
- Ownership checks ensure users can access only their own account in `src/middleware/auth.js`.
- Parameter tampering is blocked by matching route/body/query account identifiers to the authenticated session.
- Sensitive fields such as account and routing numbers are masked before responses are sent.
