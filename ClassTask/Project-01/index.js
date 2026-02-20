const express = require("express");
const fs = require("fs");
const users = require("./MOCK_DATA.json");
const app = express();
const PORT = 8000;

// Midldeware - plugin
app.use(express.urlencoded({extended:false}));
app.use(express.json());

app.get("/users",(req,res)=>{
    const html = `
    <ul>
    ${users.map((user)=> `<li>${user.first_name}</li>`).join("")}
    </ul>
    `;
    res.send(html);
});
// Routes
app.get("/api/users",(req,res)=>{
    return res.json(users);
});

app.get("/api/users/:id",(req,res)=>{
    const id = Number(req.params.id);
    const user = users.find((user) => user.id === id);
    return res.json(user);
});

app.post("/api/users",(req,res)=>{
    // TODO create a new user\
    const body = req.body;
    users.push({id: users.length+1,...body});
    fs.writeFile("./Project-01/MOCK_DATA.json",JSON.stringify(users),(err,data)=>{
        return res.json({status:"success", id:users.length});
    });
});

app.patch("/api/users/:id",(req,res)=>{
    // TODO edit the user with id
    const id = Number(req.params.id);
    const userIndex = users.findIndex((user) => user.id === id);
    if (userIndex === -1) {
        return res.status(404).json({status: "User not found"});
    }
    users[userIndex] = {...users[userIndex], ...req.body};
    fs.writeFile("./Project-01/MOCK_DATA.json", JSON.stringify(users), (err) => {
        return res.json({status: "success", id: id});
    });
    return res.json({status:"pending"});
});

app.delete("/api/users/:id",(req,res)=>{
    // TOOD delete the user with id
    const id = Number(req.params.id);
    const userIndex = users.findIndex((user) => user.id === id);
    if (userIndex === -1) {
        return res.status(404).json({status: "User not found"});
    }
    users.splice(userIndex, 1);
    fs.writeFile("./Project-01/MOCK_DATA.json", JSON.stringify(users), (err) => {
        return res.json({status: "success", id: id});
    });
    return res.json({status:"pending"});
});

app.listen(PORT,()=>{
    console.log("Server start at port 8000...");
});