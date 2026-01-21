const fs = require("fs");

const commond = process.argv[2];
const file = process.argv[3];
const content = process.argv.slice(4).join(" ");

switch(commond){
    case "read":
        fs.readFile(file,"utf-8",(err,data)=>{
            if(err) return HandleError(err);
            else console.log(data);
        });
        break;
    case "write":
        fs.writeFile(file,content,(err)=>{
            if(err) return HandleError(err);
            else console.log("File Written Successfully");
        });
        break;
    case "append":
        fs.appendFile(file,content+"\n",(err)=>{
            if(err) return HandleError(err);
            else console.log("Content Appended");
        });
        break;
    case "copy":
        const dest = process.argv[4];
        fs.copyFile(file,dest,(err)=>{
            if(err) return HandleError(err);
            else console.log("Copied Successfully");
        });
        break;
    case "delete":
        fs.unlink(file,(err)=>{
            if(err) return HandleError(err);
            else console.log("file deleted");
        });
        break;
    case "list":
        fs.readdir(file,(err,files)=>{
            if(err) return HandleError(err);
            else files.forEach(f => console.log(f));
        });
        break;
    default:
        console.log("Invalid Commond, try Again !");
}

function HandleError(err) {
  if(err.code === "ENOENT"){
    console.error("File or directory not found");
  } 
  else if(err.code === "EACCES"){
    console.error("Permission denied");
  } 
  else{
    console.error("Error:", err.message);
  }
}
