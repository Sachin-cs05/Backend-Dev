// Problem 3: Create a contact form using EJS that submits data via POST

const express = require('express');
const app = express();
const path = require('path');

// Set view engine to EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Store submitted contacts (in-memory)
let contacts = [];

// Route to display contact form
app.get('/contact', (req, res) => {
  res.render('contact_form', {
    title: 'Contact Us',
    errors: []
  });
});

// Route to handle form submission
app.post('/contact', (req, res) => {
  const { name, email, phone, message } = req.body;
  const errors = [];

  // Validation
  if (!name || name.trim() === '') {
    errors.push('Name is required');
  }
  
  if (!email || email.trim() === '') {
    errors.push('Email is required');
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push('Please enter a valid email address');
  }
  
  if (!message || message.trim() === '') {
    errors.push('Message is required');
  }

  // If there are errors, re-render the form with errors
  if (errors.length > 0) {
    return res.render('contact_form', {
      title: 'Contact Us',
      errors: errors,
      formData: { name, email, phone, message }
    });
  }

  // Save the contact
  const contact = {
    id: contacts.length + 1,
    name: name.trim(),
    email: email.trim(),
    phone: phone.trim() || 'Not provided',
    message: message.trim(),
    submittedAt: new Date().toISOString()
  };

  contacts.push(contact);

  // Render success page
  res.render('contact_success', {
    title: 'Thank You',
    contact: contact
  });
});

// Route to view all contacts (admin)
app.get('/contacts', (req, res) => {
  res.render('contacts_list', {
    title: 'All Contacts',
    contacts: contacts,
    count: contacts.length
  });
});

// Route to clear all contacts
app.post('/contacts/clear', (req, res) => {
  contacts = [];
  res.json({ message: 'All contacts cleared' });
});

// Start server
const PORT = 3002;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Visit: http://localhost:${PORT}/contact`);
  console.log(`View all contacts: http://localhost:${PORT}/contacts`);
});

module.exports = app;
