const express = require('express');

const app = express();
const PORT = 3001;

app.use(express.json());

// Predefined users for login
const users = [
  { id: 1, email: 'alice@company.com', password: 'alice123', name: 'Alice Johnson', role: 'Admin' },
  { id: 2, email: 'bob@company.com', password: 'bob123', name: 'Bob Smith', role: 'Employee' }
];

// In-memory token store: token -> user
const activeTokens = new Map();

// POST /login -> Validate credentials and return dummy token
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  const user = users.find((u) => u.email === email && u.password === password);

  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  const token = `token-${user.id}-${Date.now()}`;
  activeTokens.set(token, user);

  res.json({ token });
});

// Custom authentication middleware
function authenticateToken(req, res, next) {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized. Token missing.' });
  }

  const user = activeTokens.get(token);

  if (!user) {
    return res.status(401).json({ error: 'Unauthorized. Invalid token.' });
  }

  req.user = user;
  next();
}

// Protected routes
app.get('/dashboard', authenticateToken, (req, res) => {
  res.json({
    message: `Welcome to the dashboard, ${req.user.name}.`,
    role: req.user.role
  });
});

app.get('/profile', authenticateToken, (req, res) => {
  res.json({
    id: req.user.id,
    name: req.user.name,
    email: req.user.email,
    role: req.user.role
  });
});

// Handle invalid JSON payloads
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ error: 'Invalid input. Malformed JSON.' });
  }

  next(err);
});

// Fallback error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Task2 server running on http://localhost:${PORT}`);
});
