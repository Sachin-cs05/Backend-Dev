# Problem 06: Error Handling Without Sensitive Leakage

- `src/middleware/errorHandlers.js` returns generic 5xx responses.
- Internal stack traces are only eligible for logging in development.
- Authorization and validation errors return minimal client-safe messages.
