const express = require('express');

const app = express();

function escapeHtml(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function removeBadWords(value) {
  return value
    .replace(/--/g, '')
    .replace(/;/g, '')
    .replace(/\/\*/g, '')
    .replace(/\*\//g, '')
    .replace(/\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|ALTER|EXEC|OR|AND)\b/gi, '');
}

function cleanData(value) {
  if (typeof value === 'string') {
    let newValue = value.trim();
    newValue = removeBadWords(newValue);
    newValue = escapeHtml(newValue);
    return newValue;
  }

  if (Array.isArray(value)) {
    return value.map(cleanData);
  }

  if (value && typeof value === 'object') {
    const newObject = {};

    for (const key in value) {
      newObject[key] = cleanData(value[key]);
    }

    return newObject;
  }

  return value;
}

function dataSanitizationMiddleware(req, res, next) {
  req.body = cleanData(req.body);
  req.query = cleanData(req.query);
  req.params = cleanData(req.params);
  next();
}

app.use(express.json());
app.use(dataSanitizationMiddleware);

app.post('/comments', function (req, res) {
  res.json({
    message: 'Data sanitized',
    cleanData: req.body
  });
});

app.get('/search/:term', function (req, res) {
  res.json({
    params: req.params,
    query: req.query
  });
});

const PORT = 3005;

if (require.main === module) {
  app.listen(PORT, function () {
    console.log('Exercise 5 server running on http://localhost:' + PORT);
  });
}

module.exports = {
  app,
  dataSanitizationMiddleware,
  cleanData
};
