const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const logFilePath = path.join(__dirname, 'requests.log');

function requestLogger(req, res, next) {
  const startTime = Date.now();

  res.on('finish', function () {
    const endTime = Date.now();
    const totalTime = endTime - startTime;
    const time = new Date().toLocaleString();
    const method = req.method;
    const url = req.originalUrl;
    const statusCode = res.statusCode;

    const logMessage =
      'Time: ' + time +
      ' | Method: ' + method +
      ' | URL: ' + url +
      ' | Status: ' + statusCode +
      ' | Response Time: ' + totalTime + 'ms\n';

    fs.appendFile(logFilePath, logMessage, function (err) {
      if (err) {
        console.log('Error while writing log file');
      }
    });
  });

  next();
}

app.use(express.json());
app.use(requestLogger);

app.get('/', function (req, res) {
  res.send('Home page');
});

app.get('/reports', function (req, res) {
  setTimeout(function () {
    res.json({ message: 'Reports page' });
  }, 120);
});

app.post('/users', function (req, res) {
  res.status(201).json({
    message: 'User created',
    data: req.body
  });
});

app.use(function (req, res) {
  res.status(404).send('Page not found');
});

const PORT = 3001;

if (require.main === module) {
  app.listen(PORT, function () {
    console.log('Exercise 1 server running on http://localhost:' + PORT);
  });
}

module.exports = {
  app,
  requestLogger
};
