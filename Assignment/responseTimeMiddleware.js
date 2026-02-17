// Problem 2: Build a middleware that logs the response time for each request

const express = require('express');
const app = express();

// Middleware to log response time
const responseTimeLogger = (req, res, next) => {
  // Record the start time
  const startTime = Date.now();
  
  // Intercept the response end method
  const originalEnd = res.end;
  
  res.end = function(...args) {
    // Calculate response time in milliseconds
    const responseTime = Date.now() - startTime;
    
    // Log the response time
    console.log(`
╔════════════════════════════════════════════════════════════╗
║ REQUEST DETAILS
╠════════════════════════════════════════════════════════════╣
║ Method: ${req.method} | Status: ${res.statusCode}
║ Path: ${req.originalUrl}
║ IP Address: ${req.ip}
║ Response Time: ${responseTime}ms
║ Timestamp: ${new Date().toISOString()}
╚════════════════════════════════════════════════════════════╝
    `);
    
    // Also set a custom header with response time
    res.set('X-Response-Time', `${responseTime}ms`);
    
    // Call the original end method
    originalEnd.apply(res, args);
  };
  
  next();
};

// Alternative middleware using res.on('finish') method
const responseTimeLoggerAlt = (req, res, next) => {
  const startTime = Date.now();
  
  res.on('finish', () => {
    const responseTime = Date.now() - startTime;
    
    const logEntry = {
      timestamp: new Date().toISOString(),
      method: req.method,
      path: req.originalUrl,
      status: res.statusCode,
      responseTime: `${responseTime}ms`,
      ip: req.ip
    };
    
    console.log(logEntry);
  });
  
  next();
};

// Apply the middleware
app.use(responseTimeLogger);

// Sample routes to test the middleware
app.get('/', (req, res) => {
  res.send('Home Page');
});

app.get('/api/data', (req, res) => {
  // Simulate delay
  setTimeout(() => {
    res.json({ message: 'Data fetched successfully', data: [1, 2, 3, 4, 5] });
  }, 100);
});

app.post('/api/submit', express.json(), (req, res) => {
  // Simulate processing
  setTimeout(() => {
    res.json({ message: 'Data submitted successfully', received: req.body });
  }, 200);
});

app.get('/slow-endpoint', (req, res) => {
  // Simulate slow endpoint
  setTimeout(() => {
    res.json({ message: 'This took 500ms' });
  }, 500);
});

// Handle 404
app.use((req, res) => {
  res.status(404).send('Page not found');
});

// Start server
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Try different routes to see response times logged`);
});

module.exports = app;
