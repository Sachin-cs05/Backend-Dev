const express = require('express');
const app = express();

app.use(express.json());

let todos = [];
let id = 1;

// Create
app.post('/todos', (req, res) => {
  const todo = { id: id++, task: req.body.task };
  todos.push(todo);
  res.send(todo);
});

// Read
app.get('/todos', (req, res) => {
  res.send(todos);
});

// Update
app.put('/todos/:id', (req, res) => {
  const todo = todos.find(t => t.id == req.params.id);
  if (!todo) return res.sendStatus(404);

  todo.task = req.body.task;
  res.send(todo);
});

// Delete
app.delete('/todos/:id', (req, res) => {
  todos = todos.filter(t => t.id != req.params.id);
  res.send({ message: "Deleted" });
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
