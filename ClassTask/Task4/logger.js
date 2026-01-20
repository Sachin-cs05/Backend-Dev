const fs = require("fs");
const path = require("path");
const logFilePath = path.join(__dirname, "system-log.txt");

function logToFile(data) {
    const logMessage = `
Time: ${data.timestamp}
Platform: ${data.platform}
CPU Count: ${data.cpuCount}
Free Memory: ${data.freeMemory}
Total Memory: ${data.totalMemory}
---------------------------`;

    fs.appendFile(logFilePath, logMessage, (err) => {
        if (err) {
            console.error("Error writing log:", err);
        }
    });
}

module.exports = logToFile;
