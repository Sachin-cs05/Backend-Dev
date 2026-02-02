const http = require("http");
const fs = require("fs");
const url = require("url");

// in-memory data
let students = [
  { id: 1, name: "Aman", branch: "CSE" },
  { id: 2, name: "Sachin", branch: "CSE" }
];

// log function
function logRequest(req) {
  const log = `${new Date().toLocaleString()} - ${req.method} ${req.url}\n`;
  fs.appendFile("log.txt", log, () => {});
}

const server = http.createServer((req, res) => {
  logRequest(req);

  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  const method = req.method;

  // GET /students
  if (method === "GET" && path === "/students") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(students));
  }

  // GET /students/:id
  else if (method === "GET" && path.startsWith("/students/")) {
    const id = parseInt(path.split("/")[2]);
    const student = students.find(s => s.id === id);

    if (!student) {
      res.writeHead(404, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ message: "Student not found" }));
    }

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(student));
  }

  // POST /students
  else if (method === "POST" && path === "/students") {
    let body = "";

    req.on("data", chunk => {
      body += chunk;
    });

    req.on("end", () => {
      const newStudent = JSON.parse(body);
      newStudent.id = students.length + 1;
      students.push(newStudent);

      res.writeHead(201, { "Content-Type": "application/json" });
      res.end(JSON.stringify(newStudent));
    });
  }

  // DELETE /students/:id
  else if (method === "DELETE" && path.startsWith("/students/")) {
    const id = parseInt(path.split("/")[2]);
    const index = students.findIndex(s => s.id === id);

    if (index === -1) {
      res.writeHead(404, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ message: "Student not found" }));
    }

    const deletedStudent = students.splice(index, 1);

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(deletedStudent[0]));
  }

  // 404
  else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Route not found" }));
  }
});

server.listen(3000, () => {
  console.log("Server running on port 3000");
});
