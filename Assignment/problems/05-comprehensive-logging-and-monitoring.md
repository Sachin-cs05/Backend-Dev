# Problem 05: Comprehensive Logging And Monitoring

- `src/services/audit.service.js` provides an audit trail abstraction for financial events.
- Failed login attempts are recorded from `src/services/auth.service.js`.
- Suspicious activity indicators are generated in `src/services/fraud.service.js`.
- Fraud signals can be forwarded to monitoring infrastructure through the logger attached in `src/middleware/securityContext.js`.
