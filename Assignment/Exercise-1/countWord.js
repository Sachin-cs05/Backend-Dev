const fs = require('fs');

fs.readFile('input.txt', 'utf8', (err, data) => {
  if (err) {
    console.error(err);
    return;
  }

  const words = data.trim().split(/\s+/).length;

  fs.writeFile('output.txt', `Word Count: ${words}`, (err) => {
    if (err) {
      console.error(err);
    } else {
      console.log('Word count written to output.txt');
    }
  });
});
