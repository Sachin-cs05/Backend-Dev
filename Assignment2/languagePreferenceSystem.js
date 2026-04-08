const express = require('express');
const cookieParser = require('cookie-parser');

const app = express();

app.use(cookieParser());

const messages = {
  en: 'Welcome to the website',
  hi: 'Website par swagat hai',
  fr: 'Bienvenue sur le site'
};

app.get('/', function (req, res) {
  const language = req.cookies.language || 'en';
  const text = messages[language] || messages.en;

  res.send(`
    <h2>Language Preference System</h2>
    <p>Current Language: ${language}</p>
    <p>${text}</p>
    <a href="/set-language/en">English</a><br>
    <a href="/set-language/hi">Hindi</a><br>
    <a href="/set-language/fr">French</a>
  `);
});

app.get('/set-language/:lang', function (req, res) {
  const lang = req.params.lang;
  res.cookie('language', lang, { maxAge: 7 * 24 * 60 * 60 * 1000 });
  res.redirect('/');
});

const PORT = 4002;

if (require.main === module) {
  app.listen(PORT, function () {
    console.log('Exercise 2 running on http://localhost:' + PORT);
  });
}

module.exports = app;
