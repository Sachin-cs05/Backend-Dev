const fs = require("fs");
const path = require("path");

const answer = `Question 3: Describe three scenarios where MongoDB would be preferred over a relational database.

Answer:
1. Content Management Systems or Blogging Platforms
- MongoDB is useful when articles, comments, tags, author info, and media metadata can vary from one record to another.
- Its flexible schema allows storing different document structures without altering database tables repeatedly.

Example:
- A blog post may contain title, content, tags, images, author, reactions, and comments in one document.

2. Real-Time Analytics and Large-Scale Event Data
- MongoDB is preferred when applications collect large amounts of semi-structured logs, clickstreams, or IoT data.
- It handles high write volume and flexible data formats well.

Example:
- A fitness app storing user activity, device data, location samples, and session events.

3. E-Commerce Product Catalogs
- Product data often varies by category.
- A phone may have battery and screen fields, while shoes may have size and material fields.
- MongoDB allows storing all of these without creating many sparse relational columns.

Example:
- One collection can store electronics, clothing, and furniture with different attributes in each document.

Conclusion:
MongoDB is preferred when:
- data structure changes often,
- records are not identical,
- and the application needs flexible, scalable document storage.`;

const outputPath = path.join(__dirname, "mongodb-vs-relational-scenarios.txt");
fs.writeFileSync(outputPath, answer, "utf8");

console.log(`Answer saved to ${outputPath}`);
