const express = require('express');
const app = express();
const path = require('path');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

// normal test routes
app.get('/', function (req, res) {
  res.render('home', {
    title: 'Home Page',
    message: 'Welcome to our website!'
  });
});

app.get('/about', function (req, res) {
  res.render('about', {
    title: 'About Us'
  });
});

app.get('/blog', function (req, res) {
  res.render('blog', {
    title: 'Blog Posts'
  });
});

// koi route match nahi hua to ye page dikhao
app.use(function (req, res) {
  res.status(404).render('error_404', {
    title: '404 - Page Not Found',
    requestedUrl: req.originalUrl,
    referrer: req.get('Referer') || '/'
  });
});

// error aya to yaha aa jayega
app.use(function (err, req, res, next) {
  console.error('Error:', err);
  res.status(500).render('error_500', {
    title: '500 - Server Error',
    error: err.message
  });
});

const PORT = 3003;
app.listen(PORT, function () {
  console.log('Server running on http://localhost:' + PORT);
  console.log('Try: http://localhost:' + PORT + '/nonexistent');
});

module.exports = app;
