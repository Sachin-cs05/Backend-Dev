const express = require('express');
const app = express();

// Sample user data
const users = [
  { id: 1, name: 'John Doe', email: 'john@example.com' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
  { id: 3, name: 'John Smith', email: 'johnsmith@example.com' },
  { id: 4, name: 'Bob Johnson', email: 'bob@example.com' },
  { id: 5, name: 'Alice Brown', email: 'alice@example.com' }
];

// Route to filter users by name query parameter
app.get('/users', (req, res) => {
  const nameFilter = req.query.name;
  
  // If no name parameter provided, return all users
  if (!nameFilter) {
    return res.json({
      message: 'All users',
      users: users
    });
  }

  // Filter users by name (case-insensitive, partial match)
  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(nameFilter.toLowerCase())
  );

  res.json({
    message: `Users matching "${nameFilter}"`,
    count: filteredUsers.length,
    users: filteredUsers
  });
});

// Alternative: Filter by exact name match
app.get('/users/exact', (req, res) => {
  const nameFilter = req.query.name;
  
  if (!nameFilter) {
    return res.status(400).json({ error: 'Name parameter is required' });
  }

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase() === nameFilter.toLowerCase()
  );

  res.json({
    message: `Users with exact name "${nameFilter}"`,
    count: filteredUsers.length,
    users: filteredUsers
  });
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Try: http://localhost:${PORT}/users?name=john`);
});

module.exports = app;
