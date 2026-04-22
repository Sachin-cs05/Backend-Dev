function sanitizePlainText(value = "") {
  return String(value)
    .replace(/[<>$/]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 140);
}

function maskAccountNumber(value = "") {
  const normalized = String(value).replace(/\D/g, "");
  if (normalized.length <= 4) {
    return normalized;
  }

  return `${"*".repeat(normalized.length - 4)}${normalized.slice(-4)}`;
}

module.exports = { sanitizePlainText, maskAccountNumber };
