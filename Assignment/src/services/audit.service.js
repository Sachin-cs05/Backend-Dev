function createAuditLogger() {
  const events = [];

  return {
    events,
    log(event) {
      const entry = {
        ...event,
        createdAt: new Date().toISOString()
      };
      events.push(entry);
      return entry;
    }
  };
}

module.exports = { createAuditLogger };
