const express = require('express');
const app = express();

// ye dummy user list
const users = [
  { id: 1, name: 'John Doe', email: 'john@example.com' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
  { id: 3, name: 'John Smith', email: 'johnsmith@example.com' },
  { id: 4, name: 'Bob Johnson', email: 'bob@example.com' },
  { id: 5, name: 'Alice Brown', email: 'alice@example.com' }
];

// simple route, name query aya to filter karo
app.get('/users', function (req, res) {
  const nameFilter = req.query.name;

  if (!nameFilter) {
    return res.json({
      message: 'All users',
      users: users
    });
  }

  const textToFind = String(nameFilter).toLowerCase();
  const filteredUsers = [];

  for (let i = 0; i < users.length; i++) {
    const oneUser = users[i];
    if (oneUser.name.toLowerCase().includes(textToFind)) {
      filteredUsers.push(oneUser);
    }
  }

  res.json({
    message: 'Users matching "' + nameFilter + '"',
    count: filteredUsers.length,
    users: filteredUsers
  });
});

// exact name match wala alag route hai
app.get('/users/exact', function (req, res) {
  const nameFilter = req.query.name;

  if (!nameFilter) {
    return res.status(400).json({
      error: 'Name parameter is required'
    });
  }

  const textToFind = String(nameFilter).toLowerCase();
  const filteredUsers = [];

  for (let i = 0; i < users.length; i++) {
    const oneUser = users[i];
    if (oneUser.name.toLowerCase() === textToFind) {
      filteredUsers.push(oneUser);
    }
  }

  res.json({
    message: 'Users with exact name "' + nameFilter + '"',
    count: filteredUsers.length,
    users: filteredUsers
  });
});

const PORT = 3000;
app.listen(PORT, function () {
  console.log('Server running on http://localhost:' + PORT);
  console.log('Try: http://localhost:' + PORT + '/users?name=john');
});

module.exports = app;
