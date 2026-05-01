const express = require("express");
const session = require("express-session");

const app = express();
const PORT = 3000;

const user = {
  username: "admin",
  password: "1234",
};

app.use(express.json());

app.use(
  session({
    secret: "my-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 10,
    },
  })
);

function isLoggedIn(req, res, next) {
  if (req.session.user) {
    return next();
  }

  return res.status(401).send("Please login first");
}

app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (username === user.username && password === user.password) {
    req.session.user = user.username;
    return res.send("Login Successful");
  }

  return res.status(401).send("Invalid Credentials");
});

app.get("/dashboard", isLoggedIn, (req, res) => {
  res.send(`Welcome ${req.session.user}, this is your dashboard`);
});

app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send("Logout failed");
    }

    res.clearCookie("connect.sid");
    return res.send("Logged out successfully");
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});