const fs = require('fs');
const path = require('path');

const outputDir = __dirname;

const answers = [
  {
    fileName: 'advantages-of-using-mongoose-over-native-mongodb-driver.txt',
    content: `1. Advantages of Using Mongoose Over the Native MongoDB Driver

Mongoose provides a higher-level abstraction on top of the native MongoDB driver, which makes development easier and more structured.

Advantages:

1. Schema-based structure
Mongoose allows you to define schemas for your collections. This helps maintain a clear structure for documents, while the native MongoDB driver is schema-less by default.

2. Built-in validation
You can add validation rules such as required fields, min/max length, enums, and custom validators directly in the schema.

3. Middleware support
Mongoose supports pre and post middleware for operations like save, validate, remove, and update. This is useful for tasks like hashing passwords or logging.

4. Easier relationships
Mongoose supports population, which makes it easier to work with referenced documents between collections.

5. Model-based development
Mongoose uses models that make CRUD operations cleaner and more organized compared to writing raw collection queries with the native driver.

6. Virtuals and getters/setters
You can define virtual fields and custom getters/setters to transform data without storing extra fields in the database.

7. Cleaner code and better maintainability
Because of schemas, models, and middleware, code is usually more readable and easier to manage in large projects.

Conclusion:
Use Mongoose when you want structure, validation, maintainability, and developer-friendly features. Use the native driver when you need more low-level control or maximum performance with fewer abstractions.
`,
  },
  {
    fileName: 'difference-between-findoneandupdate-and-updateone.txt',
    content: `2. Difference Between findOneAndUpdate() and updateOne()

Both methods are used to update documents in MongoDB, but they behave differently.

findOneAndUpdate():
- Finds a single matching document and updates it.
- Can return the matched document.
- Useful when you want the updated document after the operation.
- Commonly used when you need both update and fetch in one step.

Example:
await User.findOneAndUpdate(
  { email: 'test@example.com' },
  { name: 'Sachin' },
  { new: true }
);

In this case, { new: true } returns the updated document.

updateOne():
- Updates the first matching document.
- Does not return the updated document.
- Returns a result object containing information like matchedCount and modifiedCount.
- Useful when you only want to update a document and do not need the document back.

Example:
await User.updateOne(
  { email: 'test@example.com' },
  { $set: { name: 'Sachin' } }
);

Main Difference:
- findOneAndUpdate() returns the document (old or updated depending on options).
- updateOne() returns the update result summary, not the document itself.
`,
  },
  {
    fileName: 'purpose-of-middleware-in-mongoose.txt',
    content: `3. Purpose of Middleware in Mongoose

Middleware in Mongoose is used to run logic before or after certain database operations.

It helps automate common tasks and keeps your code clean.

Types of middleware:

1. Pre middleware
Runs before an operation.
Example:
- before save
- before validate
- before deleteOne

2. Post middleware
Runs after an operation.
Example:
- after save
- after find

Common use cases of middleware:

1. Hashing passwords before saving a user
2. Logging database actions
3. Validating or modifying data before storing it
4. Automatically updating timestamps
5. Running cleanup logic after delete operations

Example:
userSchema.pre('save', async function (next) {
  console.log('Before saving user');
  next();
});

Purpose in simple words:
Middleware acts like hooks that allow you to add custom logic around database operations without repeating the same code in many places.
`,
  },
  {
    fileName: 'how-to-implement-pagination-in-mongoose.txt',
    content: `4. How to Implement Pagination in Mongoose

Pagination is used to fetch data in smaller chunks instead of loading all documents at once.

In Mongoose, pagination is commonly implemented using:
- skip()
- limit()

Example:
const page = 2;
const limit = 5;
const skip = (page - 1) * limit;

const users = await User.find().skip(skip).limit(limit);

How it works:
- page = current page number
- limit = number of documents per page
- skip = number of documents to skip

For page 2 with limit 5:
- skip = (2 - 1) * 5 = 5
- MongoDB skips first 5 documents and returns the next 5

Better pagination response:
You can also return total records and total pages.

Example:
const page = 1;
const limit = 10;
const skip = (page - 1) * limit;

const total = await User.countDocuments();
const users = await User.find().skip(skip).limit(limit);

const result = {
  currentPage: page,
  totalPages: Math.ceil(total / limit),
  totalRecords: total,
  data: users
};

Conclusion:
Use skip() and limit() for basic pagination. For very large datasets, cursor-based pagination is often more efficient than skip-based pagination.
`,
  },
  {
    fileName: 'when-to-use-embedding-vs-referencing-in-mongodb-schema-design.txt',
    content: `5. When to Use Embedding vs Referencing in MongoDB Schema Design

Embedding and referencing are two ways to model relationships in MongoDB.

1. Embedding
In embedding, related data is stored inside the same document.

Example:
{
  name: 'Sachin',
  address: {
    city: 'Delhi',
    zip: '110001'
  }
}

Use embedding when:
- The related data is small
- The related data is accessed together most of the time
- The relationship is one-to-one or one-to-few
- You want faster reads with fewer queries

Advantages:
- Better read performance
- Simpler queries
- Data stays together in one document

2. Referencing
In referencing, related data is stored in separate documents and linked using ObjectId references.

Example:
{
  name: 'Sachin',
  department: ObjectId('...')
}

Use referencing when:
- The related data is large
- The relationship is one-to-many or many-to-many
- The related data changes often
- You want to avoid duplicating data
- Different collections need to share the same related document

Advantages:
- Better normalization
- Avoids duplication
- More flexible for complex relationships

Conclusion:
- Use embedding for closely related data that is usually read together.
- Use referencing for large, reusable, or complex relational data.
`,
  },
];

for (const answer of answers) {
  const filePath = path.join(outputDir, answer.fileName);
  fs.writeFileSync(filePath, answer.content, 'utf8');
  console.log(`Created: ${answer.fileName}`);
}

