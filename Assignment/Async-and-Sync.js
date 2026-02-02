const fs = require("fs");

/* 1️. Sync vs Async */
fs.writeFile(
  "./1-sync-vs-async.txt",
  "Synchronous file operation:\nThe program stops until the file task is completed.\n\nAsynchronous file operation:\nThe file task runs in the background and the program continues executing.",
  (err) => {
    if (err) {
      console.log("Error", err);
    } else {
      console.log("File 1 written");
    }
  }
);

/* 2️. File Streams */
fs.writeFile(
  "./2-file-streams.txt",
  "File streams are used when the file is very large.\nStreams read or write the file in small parts (chunks).\nThis helps in using less memory.",
  (err) => {
    if (err) {
      console.log("Error", err);
    } else {
      console.log("File 2 written");
    }
  }
);

/* 3️. utf8 encoding */
fs.writeFile(
  "./3-utf8.txt",
  "The utf8 encoding is used to convert file data into readable text.\nIf utf8 is not used, the data may be returned in buffer format.",
  (err) => {
    if (err) {
      console.log("Error", err);
    } else {
      console.log("File 3 written");
    }
  }
);

/* 4️. Common Error Codes */
fs.writeFile(
  "./4-error-codes.txt",
  "ENOENT: File or folder does not exist\nEACCES: Permission denied\nEISDIR: A directory was found instead of a file\nENOTDIR: A file was found instead of a directory",
  (err) => {
    if (err) {
      console.log("Error", err);
    } else {
      console.log("File 4 written");
    }
  }
);

/* 5️. Delete directory safely */
fs.writeFile(
  "./5-delete-directory.txt",
  "To safely delete a directory, fs.rm() is used with the recursive option.\nThe recursive option also deletes all files inside the folder.",
  (err) => {
    if (err) {
      console.log("Error", err);
    } else {
      console.log("File 5 written");
    }
  }
);

/* 6️. Piping in streams */
fs.writeFile(
  "./6-piping.txt",
  "Piping means sending data from one stream directly to another stream.\nExample: readStream.pipe(writeStream)\nThis makes file copying or transferring easy.",
  (err) => {
    if (err) {
      console.log("Error", err);
    } else {
      console.log("File 6 written");
    }
  }
);

/* 7️. Error handling importance */
fs.writeFile(
  "./7-error-handling.txt",
  "Error handling is important because without handling errors the program may crash.\nIt can also lead to data loss or application failure.",
  (err) => {
    if (err) {
      console.log("Error", err);
    } else {
      console.log("File 7 written");
    }
  }
);

/* 8️. writeFile vs appendFile */
fs.writeFile(
  "./8-write-vs-append.txt",
  "writeFile overwrites the entire file content.\nappendFile adds new data at the end of the file.\nappendFile does not delete existing data.",
  (err) => {
    if (err) {
      console.log("Error", err);
    } else {
      console.log("File 8 written");
    }
  }
);
