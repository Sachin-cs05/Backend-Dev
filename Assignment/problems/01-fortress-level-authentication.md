# Problem 01: Fortress-Level Authentication

- Secure login with session-based authentication is implemented in `src/routes/auth.routes.js` and `src/config/session.js`.
- Sessions use encrypted `MongoStore`, 15-minute rolling expiry, `__Host-` cookie naming, `HttpOnly`, `Secure`, and `SameSite=Strict`.
- Transactions above `$1,000` require step-up authentication through OTP or biometric assertion in `src/services/auth.service.js`.
- Device fingerprinting is generated in `src/middleware/deviceFingerprint.js`.
- Suspicious activity indicators are computed in `src/services/fraud.service.js`.
- Password reset tokens are random, expiring, and one-time-use via `src/services/token.service.js` and `src/services/auth.service.js`.
- Mobile biometric support is modeled through the `biometricAssertion` field on high-value transactions.
