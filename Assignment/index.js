const express = require("express");
const fs = require("fs");

const app = express();
const PORT = 8000;

app.use(express.json());

let books = require("./books.json");
let authors = require("./authors.json");

function saveBooksData() {
  fs.writeFileSync("./books.json", JSON.stringify(books, null, 2));
}

function saveAuthorsData() {
  fs.writeFileSync("./authors.json", JSON.stringify(authors, null, 2));
}

function validateYear(req, res, next) {
  if (req.body.year === undefined) {
    return next();
  }

  const year = Number(req.body.year);
  const currentYear = new Date().getFullYear();

  if (Number.isNaN(year)) {
    return res.status(400).json({
      message: "Year valid number hona chahiye"
    });
  }

  if (year < 1000 || year > currentYear + 1) {
    return res.status(400).json({
      message: `Year 1000 se ${currentYear + 1} ke beech hona chahiye`
    });
  }

  req.body.year = year;
  next();
}

// Exercise 1 + 3 + 5: Filter + Pagination + Search
app.get("/api/books", (req, res) => {
  let result = [...books];

  if (req.query.author) {
    const authorQuery = req.query.author.toLowerCase();
    result = result.filter((book) =>
      book.author.toLowerCase().includes(authorQuery)
    );
  }

  if (req.query.year) {
    const yearQuery = Number(req.query.year);
    result = result.filter((book) => book.year === yearQuery);
  }

  if (req.query.title) {
    const titleQuery = req.query.title.toLowerCase();
    result = result.filter((book) =>
      book.title.toLowerCase().includes(titleQuery)
    );
  }

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedData = result.slice(startIndex, endIndex);

  return res.json({
    totalItems: result.length,
    page: page,
    limit: limit,
    data: paginatedData
  });
});

app.get("/api/books/:id", (req, res) => {
  const id = Number(req.params.id);
  const book = books.find((item) => item.id === id);

  if (!book) {
    return res.status(404).json({ message: "Book nahi mila" });
  }

  return res.json(book);
});

app.post("/api/books", validateYear, (req, res) => {
  const { title, author, year } = req.body;

  if (!title || !author || year === undefined) {
    return res.status(400).json({
      message: "title, author aur year required hai"
    });
  }

  const newBook = {
    id: books.length ? books[books.length - 1].id + 1 : 1,
    title,
    author,
    year
  };

  books.push(newBook);
  saveBooksData();

  return res.status(201).json({
    message: "Book add ho gayi",
    data: newBook
  });
});

app.patch("/api/books/:id", validateYear, (req, res) => {
  const id = Number(req.params.id);
  const index = books.findIndex((item) => item.id === id);

  if (index === -1) {
    return res.status(404).json({ message: "Book nahi mili" });
  }

  books[index] = { ...books[index], ...req.body };
  saveBooksData();

  return res.json({
    message: "Book update ho gayi",
    data: books[index]
  });
});

app.delete("/api/books/:id", (req, res) => {
  const id = Number(req.params.id);
  const index = books.findIndex((item) => item.id === id);

  if (index === -1) {
    return res.status(404).json({ message: "Book nahi mili" });
  }

  const deletedBook = books[index];
  books.splice(index, 1);
  saveBooksData();

  return res.json({
    message: "Book delete ho gayi",
    data: deletedBook
  });
});

// Exercise 4: Authors CRUD
app.get("/api/authors", (req, res) => {
  return res.json(authors);
});

app.get("/api/authors/:id", (req, res) => {
  const id = Number(req.params.id);
  const author = authors.find((item) => item.id === id);

  if (!author) {
    return res.status(404).json({ message: "Author nahi mila" });
  }

  return res.json(author);
});

app.post("/api/authors", (req, res) => {
  const { name, country } = req.body;

  if (!name || !country) {
    return res.status(400).json({
      message: "name aur country required hai"
    });
  }

  const newAuthor = {
    id: authors.length ? authors[authors.length - 1].id + 1 : 1,
    name,
    country
  };

  authors.push(newAuthor);
  saveAuthorsData();

  return res.status(201).json({
    message: "Author add ho gaya",
    data: newAuthor
  });
});

app.patch("/api/authors/:id", (req, res) => {
  const id = Number(req.params.id);
  const index = authors.findIndex((item) => item.id === id);

  if (index === -1) {
    return res.status(404).json({ message: "Author nahi mila" });
  }

  authors[index] = { ...authors[index], ...req.body };
  saveAuthorsData();

  return res.json({
    message: "Author update ho gaya",
    data: authors[index]
  });
});

app.delete("/api/authors/:id", (req, res) => {
  const id = Number(req.params.id);
  const index = authors.findIndex((item) => item.id === id);

  if (index === -1) {
    return res.status(404).json({ message: "Author nahi mila" });
  }

  const deletedAuthor = authors[index];
  authors.splice(index, 1);
  saveAuthorsData();

  return res.json({
    message: "Author delete ho gaya",
    data: deletedAuthor
  });
});

app.listen(PORT, () => {
  console.log(`Server chal raha hai port ${PORT} par`);
});
