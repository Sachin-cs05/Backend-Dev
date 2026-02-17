const express = require('express');

const app = express();
const PORT = 3000;

app.use(express.json());

// Logger middleware: logs request method and URL.
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// In-memory users array
let users = [
  { id: 1, name: 'Alice Johnson', email: 'alice@company.com', role: 'Admin' },
  { id: 2, name: 'Bob Smith', email: 'bob@company.com', role: 'Employee' }
];

// Validation middleware for creating/updating users
function validateUser(req, res, next) {
  const { name, email, role } = req.body;

  if (!name || !email || !role) {
    return res.status(400).json({
      error: 'Invalid input. Required fields: name, email, role.'
    });
  }

  next();
}

// GET /users -> Fetch all users
app.get('/users', (req, res) => {
  res.json(users);
});

// GET /users/:id -> Fetch user by ID
app.get('/users/:id', (req, res) => {
  const id = Number(req.params.id);
  const user = users.find((u) => u.id === id);

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.json(user);
});

// POST /users -> Add a new user
app.post('/users', validateUser, (req, res) => {
  const { name, email, role } = req.body;
  const newId = users.length ? Math.max(...users.map((u) => u.id)) + 1 : 1;

  const newUser = { id: newId, name, email, role };
  users.push(newUser);

  res.status(201).json(newUser);
});

// PUT /users/:id -> Update user details
app.put('/users/:id', validateUser, (req, res) => {
  const id = Number(req.params.id);
  const index = users.findIndex((u) => u.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'User not found' });
  }

  const { name, email, role } = req.body;
  users[index] = { id, name, email, role };

  res.json(users[index]);
});

// DELETE /users/:id -> Remove a user
app.delete('/users/:id', (req, res) => {
  const id = Number(req.params.id);
  const index = users.findIndex((u) => u.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'User not found' });
  }

  const deletedUser = users[index];
  users.splice(index, 1);

  res.json({ message: 'User removed successfully', user: deletedUser });
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
  console.log(`Server running on http://localhost:${PORT}`);
});
