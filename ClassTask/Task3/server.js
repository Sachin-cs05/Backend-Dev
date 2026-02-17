const express = require('express');
const path = require('path');

const app = express();
const PORT = 3002;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));

let students = [
  { id: 1, name: 'Aarav Sharma', marks: 84, grade: 'A' },
  { id: 2, name: 'Meera Singh', marks: 67, grade: 'B' },
  { id: 3, name: 'Rohan Verma', marks: 38, grade: 'D' }
];

app.get('/', (req, res) => {
  res.redirect('/students');
});

app.get('/students', (req, res) => {
  res.render('students', { students });
});

app.get('/students/:id', (req, res) => {
  const id = Number(req.params.id);
  const student = students.find((s) => s.id === id);

  if (!student) {
    return res.status(404).send('Student not found');
  }

  res.render('student-detail', { student });
});

app.get('/add-student', (req, res) => {
  res.render('add-student');
});

app.post('/add-student', (req, res) => {
  const { name, marks, grade } = req.body;

  if (!name || marks === undefined || !grade) {
    return res.status(400).send('All fields are required');
  }

  const numericMarks = Number(marks);

  if (Number.isNaN(numericMarks)) {
    return res.status(400).send('Marks must be a number');
  }

  const newId = students.length ? Math.max(...students.map((s) => s.id)) + 1 : 1;

  students.push({
    id: newId,
    name,
    marks: numericMarks,
    grade
  });

  res.redirect('/students');
});

app.listen(PORT, () => {
  console.log(`Task3 server running on http://localhost:${PORT}`);
});
