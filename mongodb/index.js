const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient, ObjectID } = require('mongodb');

const app = express();
const PORT = process.env.PORT || 4000;

const mongoURL = 'mongodb://localhost:27017';
const dbName = 'studentdata';

// Middleware
app.use(bodyParser.json());

// Connect to MongoDB
let db;

MongoClient.connect(mongoURL, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
  if (err) {
    console.error(err);
    return;
  }

  console.log('Connected to MongoDB');
  db = client.db(dbName);

  // Start the server after connecting to MongoDB
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});

// Routes

// GET method to retrieve all students
app.get('/students', (req, res) => {
  db.collection('students')
    .find()
    .toArray((err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
        return;
      }

      res.json(result);
    });
});

// POST method to add a new student
app.post('/students', (req, res) => {
  const { ids,name, age, grade } = req.body;

  if (!ids || !name || !age || !grade) {
    return res.status(400).send('Name, age, and grade are required.');
  }

  const student = {
    ids:parseInt(ids),
    name,
    age: parseInt(age),
    grade,
  };

  db.collection('students')
    .insertOne(student, (err) => {
      if (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
        return;
      }

      res.status(201).send('Student added successfully.');
    });
});

// PUT method to update a student
app.put('/students/:id', (req, res) => {
  const studentId = req.params.id;
  const { ids,name, age, grade } = req.body;

  if (!ids || !name || !age || !grade) {
    return res.status(400).send('ids, Name, age, and grade are required.');
  }

  const query = { _id: new ObjectID(studentId) };
  const update = { $set: {ids:parseInt(ids), name, age: parseInt(age), grade } };

  db.collection('students')
    .updateOne(query, update, (err) => {
      if (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
        return;
      }

      res.status(200).send('Student updated successfully.');
    });
});

// DELETE method to delete a student
app.delete('/students/:id', (req, res) => {
  const studentId = req.params.id;

  const query = { _id: new ObjectID(studentId) };

  db.collection('students')
    .deleteOne(query, (err) => {
      if (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
        return;
      }

      res.status(200).send('Student deleted successfully.');
    });
});
