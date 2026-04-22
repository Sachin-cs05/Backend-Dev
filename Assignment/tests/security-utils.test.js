const test = require("node:test");
const assert = require("node:assert/strict");

const { sanitizePlainText, maskAccountNumber } = require("../src/utils/sanitize");
const { buildFingerprint } = require("../src/middleware/deviceFingerprint");
const { createAuditLogger } = require("../src/services/audit.service");
const { buildAuthService } = require("../src/services/auth.service");
const { buildTransactionService } = require("../src/services/transaction.service");

test("sanitizePlainText strips dangerous characters", () => {
  assert.equal(sanitizePlainText("<script>$Alice</script>"), "scriptAlicescript");
});

test("maskAccountNumber reveals only the last four digits", () => {
  assert.equal(maskAccountNumber("123456789012"), "********9012");
});

test("device fingerprint is deterministic for the same request metadata", () => {
  const req = {
    get(header) {
      const headers = {
        "user-agent": "Mozilla/5.0",
        "accept-language": "en-IN",
        "sec-ch-ua-platform": "Windows"
      };
      return headers[header];
    },
    ip: "127.0.0.1"
  };

  assert.equal(buildFingerprint(req), buildFingerprint(req));
});

test("auth service requires step-up authentication above the threshold", () => {
  const auditLogger = createAuditLogger();
  const authService = buildAuthService({ auditLogger });

  assert.equal(authService.verifyTransactionStepUp({ amount: 1500 }).ok, false);
  assert.equal(
    authService.verifyTransactionStepUp({ amount: 1500, twoFactorCode: "654321" }).ok,
    true
  );
});

test("transaction service blocks unsafe Mongo-style selectors", () => {
  const auditLogger = createAuditLogger();
  const authService = buildAuthService({ auditLogger });
  const transactionService = buildTransactionService({ auditLogger, authService });

  assert.equal(transactionService.protectQuery({ accountId: { $ne: "" } }).ok, false);
});

test("transaction service enforces transfer amount and balance checks", () => {
  const auditLogger = createAuditLogger();
  const authService = buildAuthService({ auditLogger });
  const transactionService = buildTransactionService({ auditLogger, authService });

  assert.equal(
    transactionService.validateServerSideTransaction({
      amount: 26000,
      accountBalance: 50000,
      dailyTransferred: 0
    }).ok,
    false
  );
  assert.equal(
    transactionService.validateServerSideTransaction({
      amount: 500,
      accountBalance: 1000,
      dailyTransferred: 100
    }).ok,
    true
  );
});
