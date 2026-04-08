const express = require('express');
const session = require('express-session');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: 'simple-form-secret',
    resave: false,
    saveUninitialized: true
  })
);

app.get('/', function (req, res) {
  res.redirect('/step1');
});

app.get('/step1', function (req, res) {
  const savedData = req.session.formData || {};

  res.send(`
    <h2>Step 1</h2>
    <form method="POST" action="/step1">
      <label>Name:</label>
      <input type="text" name="name" value="${savedData.name || ''}" />
      <br><br>
      <label>Email:</label>
      <input type="email" name="email" value="${savedData.email || ''}" />
      <br><br>
      <button type="submit">Next</button>
    </form>
  `);
});

app.post('/step1', function (req, res) {
  req.session.formData = req.session.formData || {};
  req.session.formData.name = req.body.name;
  req.session.formData.email = req.body.email;
  res.redirect('/step2');
});

app.get('/step2', function (req, res) {
  const savedData = req.session.formData || {};

  res.send(`
    <h2>Step 2</h2>
    <form method="POST" action="/step2">
      <label>Phone:</label>
      <input type="text" name="phone" value="${savedData.phone || ''}" />
      <br><br>
      <label>City:</label>
      <input type="text" name="city" value="${savedData.city || ''}" />
      <br><br>
      <button type="submit">Next</button>
    </form>
    <br>
    <a href="/step1">Back</a>
  `);
});

app.post('/step2', function (req, res) {
  req.session.formData = req.session.formData || {};
  req.session.formData.phone = req.body.phone;
  req.session.formData.city = req.body.city;
  res.redirect('/step3');
});

app.get('/step3', function (req, res) {
  const savedData = req.session.formData || {};

  res.send(`
    <h2>Step 3</h2>
    <form method="POST" action="/submit">
      <label>Course:</label>
      <input type="text" name="course" value="${savedData.course || ''}" />
      <br><br>
      <label>College:</label>
      <input type="text" name="college" value="${savedData.college || ''}" />
      <br><br>
      <button type="submit">Submit</button>
    </form>
    <br>
    <a href="/step2">Back</a>
  `);
});

app.post('/submit', function (req, res) {
  req.session.formData = req.session.formData || {};
  req.session.formData.course = req.body.course;
  req.session.formData.college = req.body.college;

  const finalData = req.session.formData;

  res.send(`
    <h2>Registration Complete</h2>
    <p>Name: ${finalData.name || ''}</p>
    <p>Email: ${finalData.email || ''}</p>
    <p>Phone: ${finalData.phone || ''}</p>
    <p>City: ${finalData.city || ''}</p>
    <p>Course: ${finalData.course || ''}</p>
    <p>College: ${finalData.college || ''}</p>
  `);
});

const PORT = 4001;

if (require.main === module) {
  app.listen(PORT, function () {
    console.log('Exercise 1 running on http://localhost:' + PORT);
  });
}

module.exports = app;
