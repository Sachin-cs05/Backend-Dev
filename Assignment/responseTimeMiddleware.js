const express = require('express');
const app = express();

// ye middleware time note karta hai
function responseTimeLogger(req, res, next) {
  const startTime = Date.now();

  // jab response finish hoga tab time nikalenge
  res.on('finish', function () {
    const endTime = Date.now();
    const totalTime = endTime - startTime;

    // simple log only
    console.log(
      req.method +
      ' ' +
      req.originalUrl +
      ' | status: ' +
      res.statusCode +
      ' | time: ' +
      totalTime +
      'ms'
    );
  });

  next();
}

app.use(responseTimeLogger);

app.get('/', function (req, res) {
  res.send('Home Page');
});

app.get('/api/data', function (req, res) {
  setTimeout(function () {
    res.json({
      message: 'Data fetched successfully',
      data: [1, 2, 3, 4, 5]
    });
  }, 100);
});

app.post('/api/submit', express.json(), function (req, res) {

  setTimeout(function () {
    res.json({
      message: 'Data submitted successfully',
      received: req.body
    });
  }, 200);
});

app.get('/slow-endpoint', function (req, res) {
  setTimeout(function () {
    res.json({ message: 'This took 500ms' });
  }, 500);
});

app.use(function (req, res) {
  res.status(404).send('Page not found');
});

const PORT = 3001;
app.listen(PORT, function () {
  console.log('Server running on http://localhost:' + PORT);
  console.log('Try different routes to see response time log');
});

module.exports = app;
