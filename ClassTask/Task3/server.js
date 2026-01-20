const http = require("http");
const fs = require("fs");
const url = require("url");

// In-memory student data
let students = [
  { id: 1, name: "Rahul", branch: "CSE" },
  { id: 2, name: "Ankit", branch: "IT" }
];

// Log request to file
function logRequest(req) {
  const log = `${new Date().toISOString()} | ${req.method} | ${req.url}\n`;
  fs.appendFileSync("log.txt", log);
}

const server = http.createServer((req, res) => {
  logRequest(req);

  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  const method = req.method;

  res.setHeader("Content-Type", "application/json");

  // GET /students
  if (method === "GET" && path === "/students") {
    res.end(JSON.stringify(students));
  }

  // GET /students/:id
  else if (method === "GET" && path.startsWith("/students/")) {
    const id = parseInt(path.split("/")[2]);
    const student = students.find(s => s.id === id);

    if (student) {
      res.end(JSON.stringify(student));
    } else {
      res.statusCode = 404;
      res.end(JSON.stringify({ message: "Student not found" }));
    }
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

      res.statusCode = 201;
      res.end(JSON.stringify(newStudent));
    });
  }

  // DELETE /students/:id
  else if (method === "DELETE" && path.startsWith("/students/")) {
    const id = parseInt(path.split("/")[2]);
    const index = students.findIndex(s => s.id === id);

    if (index !== -1) {
      students.splice(index, 1);
      res.end(JSON.stringify({ message: "Student deleted" }));
    } else {
      res.statusCode = 404;
      res.end(JSON.stringify({ message: "Student not found" }));
    }
  }

  // 404 Route
  else {
    res.statusCode = 404;
    res.end(JSON.stringify({ message: "Route not found" }));
  }
});

server.listen(3000, () => {
  console.log("Server running on port 3000");
});
