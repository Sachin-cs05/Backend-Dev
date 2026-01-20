const os = require("os");

function getSystemInfo() {
    return {
        cpuCount: os.cpus().length,
        freeMemory: os.freemem(),
        totalMemory: os.totalmem(),
        platform: os.platform(),
        timestamp: new Date().toLocaleString()
    };
}

module.exports = getSystemInfo;
