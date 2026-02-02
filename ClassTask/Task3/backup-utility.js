const fs = require("fs");
const path = require("path");

// directories
const SOURCE_DIR = path.join(__dirname, "uploads");
const BACKUP_DIR = path.join(__dirname, "backup");
const LOG_FILE = path.join(__dirname, "backup.log");

// helper: write log
async function writeLog(message) {
  const logMessage = `${new Date().toLocaleString()} - ${message}\n`;
  await fs.promises.appendFile(LOG_FILE, logMessage);
}

// helper: check directory exists
async function ensureDirectory(dirPath) {
  try {
    await fs.promises.access(dirPath);
  } catch (err) {
    await fs.promises.mkdir(dirPath);
    await writeLog(`Created directory: ${dirPath}`);
  }
}

// main function
async function backupAndCleanup() {
  try {
    // check source directory
    try {
      await fs.promises.access(SOURCE_DIR);
    } catch {
      await writeLog("Source directory not found. Process stopped.");
      return;
    }

    // ensure backup directory
    await ensureDirectory(BACKUP_DIR);

    const files = await fs.promises.readdir(SOURCE_DIR);
    const now = Date.now();
    const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;

    for (let file of files) {
      const filePath = path.join(SOURCE_DIR, file);
      const stats = await fs.promises.stat(filePath);

      // only files (not folders)
      if (stats.isFile()) {
        // backup file
        const timestamp = Date.now();
        const backupFileName = `${timestamp}_${file}`;
        const backupPath = path.join(BACKUP_DIR, backupFileName);

        await fs.promises.copyFile(filePath, backupPath);
        await writeLog(`Backed up file: ${file}`);

        // delete old files
        if (now - stats.mtimeMs > SEVEN_DAYS) {
          await fs.promises.unlink(filePath);
          await writeLog(`Deleted old file: ${file}`);
        }
      }
    }

    await writeLog("Backup & cleanup completed successfully.\n");
  } catch (error) {
    await writeLog(`Error: ${error.message}`);
  }
}

// run
backupAndCleanup();
