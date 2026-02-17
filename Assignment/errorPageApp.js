// Problem 4: Set up a custom 404 error page using EJS templates

const express = require('express');
const app = express();
const path = require('path');

// Set view engine to EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.static(path.join(__dirname, 'public')));

// Sample routes
app.get('/', (req, res) => {
  res.render('home', {
    title: 'Home Page',
    message: 'Welcome to our website!'
  });
});

app.get('/about', (req, res) => {
  res.render('about', {
    title: 'About Us'
  });
});

app.get('/blog', (req, res) => {
  res.render('blog', {
    title: 'Blog Posts'
  });
});

// Custom error handling middleware for 404
app.use((req, res) => {
  // Pass the requested URL to the error page
  res.status(404).render('error_404', {
    title: '404 - Page Not Found',
    requestedUrl: req.originalUrl,
    referrer: req.get('Referer') || '/'
  });
});

// Error handling middleware for 500
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).render('error_500', {
    title: '500 - Server Error',
    error: err.message
  });
});

// Start server
const PORT = 3003;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Try: http://localhost:${PORT}/nonexistent`);
});

module.exports = app;
