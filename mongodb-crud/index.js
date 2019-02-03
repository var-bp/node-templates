// https://medium.freecodecamp.org/introduction-to-mongoose-for-mongodb-d2a7aa593c57

// Mongoose is an Object Data Modeling (ODM) library for MongoDB and Node.js. It manages
// relationships between data, provides schema validation, and is used to translate between
// objects in code and the representation of those objects in MongoDB.

// MongoDB is a schema-less NoSQL document database. It means you can store JSON documents
// in it, and the structure of these documents can vary as it is not enforced like SQL databases.
// This is one of the advantages of using NoSQL as it speeds up application development and reduces
// the complexity of deployments.

// Collections in Mongo are equivalent to tables in relational databases. They can hold multiple
// JSON documents.

// Documents are equivalent to records or rows of data in SQL. While a SQL row can reference data
// in other tables, Mongo documents usually combine that in a document.

// Fields or attributes are similar to columns in a SQL table.

// While Mongo is schema-less, SQL defines a schema via the table definition. A Mongoose ‘schema’
// is a document data structure (or shape of the document) that is enforced via the application
// layer.

// ‘Models’ are higher-order constructors that take a schema and create an instance of a document
// equivalent to records in a relational database.


// Database Connection
const mongoose = require('mongoose');
mongoose.connect(`mongodb://${server}/${database}`, { useNewUrlParser: true })
  .then(() => { console.log('Database connection successful'); })
  .catch((err) => { console.error('Database connection error'); });


// Defining the Schema
// The following types are permitted: Array, Boolean, Buffer, Date, Mixed, Number, ObjectId, String
// Mixed and ObjectId are defined under require('mongoose').Schema.Types
const validator = require('validator');
const emailSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: value => validator.isEmail(value),
  },
});


// Index
emailSchema.index({
  email: 1,
});


// Exporting a Model
module.exports = mongoose.model('Email', emailSchema);
const EmailModel = require('./email');
const emailModel = new EmailModel({
  email: 'example@gmail.com',
});


// Create Record
emailModel.save()
  .then((doc) => { console.log(doc); })
  .catch((err) => { console.error(err); });


// Fetch Record
EmailModel
  .find({ email: 'example@gmail.com' })
  .then((doc) => { console.log(doc); })
  .catch((err) => { console.error(err); });


// Update Record
EmailModel
  .findOneAndUpdate(
    { email: 'example@gmail.com' },
    { email: 'test@gmail.com' },
    {
      new: true, // return updated doc
      runValidators: true, // validate before update
    },
  )
  .then((doc) => { console.log(doc); })
  .catch((err) => { console.error(err); });


// Delete Record
EmailModel
  .findOneAndRemove({ email: 'example@gmail.com' })
  .then((response) => { console.log(response); })
  .catch((err) => { console.error(err); });


// Virtual Property
// A virtual property is not persisted to the database. We can add it to our schema as a helper
// to get and set values.
userSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});
userSchema.virtual('fullName').set(function (name) {
  const [firstName, lastName] = name.split(' ');
  this.firstName = firstName;
  this.lastName = lastName;
});
const model = new UserModel();
model.fullName = 'Thomas Anderson';
console.log(model.toJSON()); // Output model fields as JSON
console.log(model.fullName); // Output the full name

// Instance Methods
// We can create custom helper methods on the schema and access them via the model instance.
// These methods will have access to the model object
userSchema.methods.getInitials = function () {
  return this.firstName[0] + this.lastName[0];
};
cosnt model = new UserModel({
  firstName: 'Thomas',
  lastName: 'Anderson',
})
let initials = model.getInitials();
console.log(initials) // This will output: TA


// Static Methods
// Similar to instance methods, we can create static methods on the schema.
userSchema.statics.getUsers = function() {
  return new Promise((resolve, reject) => {
    this.find((err, docs) => {
      if (err) {
        console.error(err)
        return reject(err)
      }
      resolve(docs)
    })
  })
};
UserModel.getUsers()
  .then((docs) => { console.log(docs); })
  .catch((err) => { console.error(err); });


// Middleware
// Middleware are functions that run at specific stages of a pipeline. Mongoose supports
// middleware for the following operations: Aggregate, Document, Model, Query
// For instance, models have pre and post functions that take two parameters:
userSchema.pre('save', function (next) {
  const now = Date.now()
  this.updatedAt = now
  // Set a value for createdAt only if it is null
  if (!this.createdAt) this.createdAt = now;
  // Call the next function in the pre-save chain
  next();
})


// Plugins
// Suppose that we want to track when a record was created and last updated on every collection
// in our database. Instead of repeating the above process, we can create a plugin and apply it to every schema.
module.exports = function timestamp(schema) {
  // Add the two fields to the schema
  schema.add({
    createdAt: Date,
    updatedAt: Date,
  });
  // Create a pre-save hook
  schema.pre('save', function (next) {
    const now = Date.now();
    this.updatedAt = now;
    // Set a value for createdAt only if it is null
    if (!this.createdAt) this.createdAt = now;
   // Call the next function in the pre-save chain
    next();
  });
}
const timestampPlugin = require('./plugins/timestamp');
emailSchema.plugin(timestampPlugin);
userSchema.plugin(timestampPlugin);


// Query Building
UserModel
  .find() // find all users
  .skip(100) // skip the first 100 items
  .limit(10) // limit to 10 items
  .sort({ firstName: 1 }) // sort ascending by firstName
  .select({firstName: true}) // select firstName only
  .exec() // execute the query
  .then((docs) => { console.log(docs); })
  .catch((err) => { console.error(err); });
