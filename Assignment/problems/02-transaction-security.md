# Problem 02: Transaction Security

- Server-side amount and daily-limit validation lives in `src/services/transaction.service.js`.
- MongoDB injection protection is applied globally with `express-mongo-sanitize` and additionally checked in `protectQuery`.
- Input sanitization for descriptions and beneficiary names is handled in `src/utils/sanitize.js`.
- Transfer rate limiting is configured in `src/middleware/rateLimiters.js`.
- Confirmation and authorization workflow is enforced by `confirmAndAuthorizeTransfer`.
