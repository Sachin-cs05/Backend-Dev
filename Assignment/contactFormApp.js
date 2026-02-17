const express = require('express');
const app = express();
const path = require('path');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// abhi ke liye memory me save, db baad me
let contacts = [];

app.get('/contact', function (req, res) {
  res.render('contact_form', {
    title: 'Contact Us',
    errors: []
  });
});

app.post('/contact', function (req, res) {
  const name = req.body.name;
  const email = req.body.email;
  const phone = req.body.phone;
  const message = req.body.message;

  const errors = [];

  // basic validation hai, mast strict nahi
  if (!name || name.trim() === '') {
    errors.push('Name is required');
  }

  if (!email || email.trim() === '') {
    errors.push('Email is required');
  } else {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      errors.push('Please enter a valid email address');
    }
  }

  if (!message || message.trim() === '') {
    errors.push('Message is required');
  }

  if (errors.length > 0) {
    return res.render('contact_form', {
      title: 'Contact Us',
      errors: errors,
      formData: {
        name: name,
        email: email,
        phone: phone,
        message: message
      }
    });
  }

  const cleanedPhone = phone && phone.trim() !== '' ? phone.trim() : 'Not provided';

  const newContact = {
    id: contacts.length + 1,
    name: name.trim(),
    email: email.trim(),
    phone: cleanedPhone,
    message: message.trim(),
    submittedAt: new Date().toISOString()
  };

  contacts.push(newContact);

  res.render('contact_success', {
    title: 'Thank You',
    contact: newContact
  });
});

app.get('/contacts', function (req, res) {
  res.render('contacts_list', {
    title: 'All Contacts',
    contacts: contacts,
    count: contacts.length
  });
});

app.post('/contacts/clear', function (req, res) {
  contacts = [];
  res.json({ message: 'All contacts cleared' });
});

const PORT = 3002;
app.listen(PORT, function () {
  console.log('Server running on http://localhost:' + PORT);
  console.log('Visit: http://localhost:' + PORT + '/contact');
  console.log('View all contacts: http://localhost:' + PORT + '/contacts');
});

module.exports = app;
