const getSystemInfo = require("./systemInfo");
const logToFile = require("./logger");

console.log("System Monitor Started...");

setInterval(() => {
    const systemData = getSystemInfo();
    logToFile(systemData);
    console.log("System data logged...");
}, 5000);
