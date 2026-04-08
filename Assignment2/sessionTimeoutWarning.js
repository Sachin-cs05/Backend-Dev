const express = require('express');
const session = require('express-session');

const app = express();
const sessionTime = 60 * 1000;
const warningTime = 15 * 1000;

app.use(
  session({
    secret: 'timeout-warning-secret',
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: sessionTime
    }
  })
);

app.get('/', function (req, res) {
  if (!req.session.startTime) {
    req.session.startTime = Date.now();
  }

  res.send(`
    <h2>Session Timeout Warning</h2>
    <p>Your session has started.</p>
    <p>Open <a href="/session-info">session info</a> to check warning.</p>
    <p>Open <a href="/keep-alive">keep alive</a> to refresh the session.</p>
  `);
});

app.get('/session-info', function (req, res) {
  if (!req.session.startTime) {
    return res.send('Session expired or not started');
  }

  const now = Date.now();
  const timePassed = now - req.session.startTime;
  const timeLeft = sessionTime - timePassed;

  if (timeLeft <= 0) {
    return res.send('Session expired');
  }

  if (timeLeft <= warningTime) {
    return res.send('Warning: Your session will expire in ' + Math.ceil(timeLeft / 1000) + ' seconds');
  }

  res.send('Session is active. Time left: ' + Math.ceil(timeLeft / 1000) + ' seconds');
});

app.get('/keep-alive', function (req, res) {
  req.session.startTime = Date.now();
  res.send('Session refreshed');
});

const PORT = 4004;

if (require.main === module) {
  app.listen(PORT, function () {
    console.log('Exercise 4 running on http://localhost:' + PORT);
  });
}

module.exports = app;
