const fs = require("fs");
const logFile = process.argv[2] || "server.log";
const summaryFile = "summary.txt";

let totalLine = 0;
let errorCount = 0;
let warningCount = 0;
let infoCount = 0;

let buffer = "";

const readStream = fs.createReadStream(logFile,{
    encoding:"utf-8"
});
 readStream.on("data",(chunk) =>{
    buffer+=chunk;
    const lines = buffer.split("\n");
    buffer = lines.pop();
     lines.forEach(line =>{
        totalLine++;
        if(line.includes("ERROR")) errorCount++;
        else if(line.includes("WARNING")) warningCount++;
        else if(line.includes("INFO")) infoCount++;
     });
});

readStream.on("end",() =>{
    if(buffer.length>0) totalLine++;

    const report = `
    log file report
    ----------------------------
    Toatl line : ${totalLine},
    Total error : ${errorCount},
    warning count : ${warningCount},
    Info count : ${infoCount}
    `;

    fs.writeFile(summaryFile,report,(err)=>{
        if(err) console.log("Error");
        else console.log(summaryFile);
    });
});

readStream.on("error",(err) =>{
    console.log(err.message);
});