# Problem 04: Production-Ready Security Configuration

- Helmet is configured for a financial application in `src/config/helmet.js`.
- A strict CSP is defined with self-only defaults and no object embedding.
- HTTPS enforcement middleware blocks insecure transport outside development.
- Secure cookie settings are defined in `src/config/session.js`.
- Session persistence uses encrypted `MongoStore`.
