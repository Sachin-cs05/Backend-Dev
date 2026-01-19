const http = require("http");
const fs = require("fs");

const myServer = http.createServer((req,res) =>{
    let str;
    switch(req.url){
        case '/':
            str = "this is Home Page";
            break;
        case "/about":
            str = "This is About Page";
            break;
        case "/contact":
        str = "This is Contact Page";
            break;
        default:
        str = "404 Page Not Found";
        break;
    }
    res.end(str);

    const log = `${Date.now()} : ${req.method} ${req.url} new Request Received\n ${str}\n`;
    console.log(log);

    fs.appendFile("log.txt",log,(err) => {
        if(err){
            console.log("Error writing log");
        }
    });
});

myServer.listen(10000, () => {
    console.log("server started at port 10000");
});