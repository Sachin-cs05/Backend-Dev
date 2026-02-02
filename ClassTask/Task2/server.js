const http = require("http");
const url = require("url");

const server = http.createServer((req, res) => {

  // URL parse kar rahe hain
  const parsedUrl = url.parse(req.url, true);
  const pathName = parsedUrl.pathname;

  // HOME ROUTE
  if (req.method === "GET" && pathName === "/") {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("Welcome to my Node.js server");
  }

  // ABOUT ROUTE
  else if (req.method === "GET" && pathName === "/about") {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(`
      <html>
        <body>
          <h1>About Page</h1>
          <p>This is a simple Node.js HTTP server.</p>
        </body>
      </html>
    `);
  }

  // USER ROUTE
  else if (req.method === "GET" && pathName === "/user") {
    const name = parsedUrl.query.name || "Unknown";
    const age = parsedUrl.query.age || "Not provided";

    const userData = {
      name: name,
      age: age
    };

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(userData));
  }

  // INVALID ROUTE
  else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("404 Page Not Found");
  }

});

// SERVER LISTEN
server.listen(3000, () => {
  console.log("Server running on port 3000");
});
