const files = [
  "./sql-vs-nosql-differences",
  "./cap-theorem-explanation",
  "./mongodb-vs-relational-scenarios",
  "./why-mongodb-uses-bson",
  "./mongodb-student-queries",
];

for (const file of files) {
  require(file);
}

console.log("All answer files have been generated.");
