# Problem 09: Endpoint Rate Limiting Strategy

- General API endpoints: `100 requests/minute`
- Login endpoint: `10 attempts/10 minutes`
- Password reset requests: `5 requests/hour`
- Money transfers: `5 requests/15 minutes`

These rules are implemented in `src/middleware/rateLimiters.js` and applied centrally in `src/app.js`.
