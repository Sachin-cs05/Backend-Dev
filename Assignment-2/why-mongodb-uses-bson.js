const fs = require("fs");
const path = require("path");

const answer = `Question 4: Why does MongoDB use BSON internally instead of storing documents as JSON?

Answer:
MongoDB uses BSON (Binary JSON) instead of plain JSON because BSON is more efficient for storage, traversal, and additional data types.

Reasons:
1. Binary Format
- BSON is stored in binary form, which is faster for machines to read and process than plain text JSON.

2. Supports More Data Types
- JSON supports only basic types like string, number, array, object, boolean, and null.
- BSON supports additional types such as:
  - Date
  - ObjectId
  - Binary data
  - Decimal128
  - Timestamp
  - Regular expression

Example:
- MongoDB uses ObjectId for unique document identifiers, which JSON does not support directly.

3. Faster Traversal
- BSON stores length information for fields and documents, making it easier for MongoDB to scan and access data quickly.

4. Better Internal Efficiency
- BSON is designed for database operations, so it is more suitable for indexing, encoding, and decoding compared to plain JSON.

Conclusion:
MongoDB uses BSON because it is faster, supports richer data types, and is better optimized for internal database operations than JSON.`;

const outputPath = path.join(__dirname, "why-mongodb-uses-bson.txt");
fs.writeFileSync(outputPath, answer, "utf8");

console.log(`Answer saved to ${outputPath}`);
