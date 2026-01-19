const http = require('http');
const url = require('url');

const server = http.createServer((req, res) => {

  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  const query = parsedUrl.query;

  if (req.method === 'GET' && path === '/') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Welcome to the Node.js HTTP Server');
  }

  else if (req.method === 'GET' && path === '/about') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end('<h1>About Page</h1><p>This is a simple Node.js server.</p>');
  }

  else if (req.method === 'GET' && path === '/user') {
    const name = query.name || 'Unknown';
    const age = query.age || 'Not provided';

    const userData = {
      name: name,
      age: age
    };

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(userData));
  }

  else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('404 Page Not Found');
  }
});

server.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
