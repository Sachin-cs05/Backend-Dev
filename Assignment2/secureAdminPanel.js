const express = require('express');
const session = require('express-session');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: 'admin-panel-secret',
    resave: false,
    saveUninitialized: true
  })
);

const users = [
  { username: 'admin', password: '1234', role: 'admin' },
  { username: 'sachin', password: '1111', role: 'user' }
];

function checkLogin(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    res.send('Please login first');
  }
}

function checkAdmin(req, res, next) {
  if (req.session.user && req.session.user.role === 'admin') {
    next();
  } else {
    res.send('Only admin can open this page');
  }
}

app.get('/', function (req, res) {
  res.send(`
    <h2>Secure Admin Panel</h2>
    <form method="POST" action="/login">
      <input type="text" name="username" placeholder="Username" />
      <br><br>
      <input type="password" name="password" placeholder="Password" />
      <br><br>
      <button type="submit">Login</button>
    </form>
  `);
});

app.post('/login', function (req, res) {
  const username = req.body.username;
  const password = req.body.password;

  const foundUser = users.find(function (user) {
    return user.username === username && user.password === password;
  });

  if (!foundUser) {
    return res.send('Wrong username or password');
  }

  req.session.user = {
    username: foundUser.username,
    role: foundUser.role
  };

  res.send('Login successful. Go to /dashboard or /admin');
});

app.get('/dashboard', checkLogin, function (req, res) {
  res.send('Welcome ' + req.session.user.username + '. Your role is ' + req.session.user.role);
});

app.get('/admin', checkLogin, checkAdmin, function (req, res) {
  res.send('Welcome to admin panel');
});

app.get('/logout', function (req, res) {
  req.session.destroy(function () {
    res.send('Logged out successfully');
  });
});

const PORT = 4003;

if (require.main === module) {
  app.listen(PORT, function () {
    console.log('Exercise 3 running on http://localhost:' + PORT);
  });
}

module.exports = app;
