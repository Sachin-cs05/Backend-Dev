const fs = require("fs");
const path = require("path");

const answer = `Question 1: Explain the key differences between SQL and NoSQL databases with examples.

Answer:
1. Data Model
- SQL databases store data in tables with rows and columns.
- NoSQL databases store data in flexible formats such as documents, key-value pairs, graphs, or wide-column stores.

Example:
- SQL: MySQL, PostgreSQL
- NoSQL: MongoDB, Redis, Cassandra

2. Schema
- SQL databases use a fixed schema. The structure of the table must be defined before inserting data.
- NoSQL databases usually use a dynamic schema, so documents can have different fields.

Example:
- In MySQL, a Student table may require columns like id, name, gpa, and course.
- In MongoDB, one student document can include extra fields like hobbies without changing the full collection structure.

3. Relationships
- SQL databases are strong for handling relationships using joins and foreign keys.
- NoSQL databases usually avoid heavy joins and often keep related data together in one document.

Example:
- SQL is useful for banking systems where customers, accounts, and transactions are related.
- MongoDB is useful for product catalogs where product details can be stored in a single document.

4. Scalability
- SQL databases are commonly scaled vertically by increasing server power.
- NoSQL databases are commonly scaled horizontally by adding more servers.

Example:
- PostgreSQL often runs on a larger single machine.
- Cassandra is designed to scale across many distributed nodes.

5. Consistency and Transactions
- SQL databases usually follow ACID properties and provide strong consistency.
- NoSQL databases often focus on availability and scalability, sometimes using eventual consistency depending on the database.

Example:
- SQL is preferred for payment systems.
- NoSQL is preferred for social media feeds or analytics platforms.

6. Query Language
- SQL databases use Structured Query Language (SQL).
- NoSQL databases use database-specific query styles.

Example:
- SQL query: SELECT * FROM students WHERE gpa > 3.5;
- MongoDB query: db.students.find({ gpa: { $gt: 3.5 } });

Conclusion:
SQL is best when data is structured and relationships are important.
NoSQL is best when data is large-scale, flexible, and distributed.`;

const outputPath = path.join(__dirname, "sql-vs-nosql-differences.txt");
fs.writeFileSync(outputPath, answer, "utf8");

console.log(`Answer saved to ${outputPath}`);
