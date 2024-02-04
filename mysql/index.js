const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');

const app = express();
const PORT = process.env.PORT || 4000;

// Configuration for MySQL
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'root123',
  database: 'studentdata',
};

const pool = mysql.createPool(dbConfig);

// Middleware
app.use(bodyParser.json());

// Routes

// GET method to retrieve all students
app.get('/students', (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
      return;
    }

    connection.query('SELECT * FROM Students', (error, results) => {
      connection.release();
      
      if (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
        return;
      }

      res.json(results);
    });
  });
});

// POST method to add a new student
app.post('/students', (req, res) => {
  const {id, name, age, grade } = req.body;
  if (!id || !name || !age || !grade) {
    return res.status(400).send('id, Name, age, and grade are required.');
  }

  pool.getConnection((err, connection) => {
    if (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
      return;
    }

    connection.query(
      'INSERT INTO Students (id,Name, Age, Grade) VALUES (?, ?, ?, ?)',
      [id,name, age, grade],
      (error) => {
        connection.release();
        
        if (error) {
          console.error(error);
          res.status(500).send('Internal Server Error');
          return;
        }

        res.status(201).send('Student added successfully.');
      }
    );
  });
});

// POST method to add a new student or a list of students
app.post('/studentslist', (req, res) => {
    const students = req.body;
  
    if (!students || !Array.isArray(students) || students.length === 0) {
      return res.status(400).send('Invalid student data.');
    }
  
    const values = students.map((student) => [student.id,student.name, student.age, student.grade]);
  
    pool.getConnection((err, connection) => {
      if (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
        return;
      }
  
      connection.query(
        'INSERT INTO Students (id,Name, Age, Grade) VALUES ?',
        [values],
        (error) => {
          connection.release();
  
          if (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
            return;
          }
  
          res.status(201).send('Students added successfully.');
        }
      );
    });
  });
  

// PUT method to update a student
app.put('/students/:id', (req, res) => {
  const id = req.params.id;
  const { name, age, grade } = req.body;
  if (!name || !age || !grade) {
    return res.status(400).send('Name, age, and grade are required.');
  }

  pool.getConnection((err, connection) => {
    if (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
      return;
    }

    connection.query(
      'UPDATE Students SET Name = ?, Age = ?, Grade = ? WHERE id = ?',
      [name, age, grade, id],
      (error) => {
        connection.release();

        if (error) {
          console.error(error);
          res.status(500).send('Internal Server Error');
          return;
        }

        res.status(200).send('Student updated successfully.');
      }
    );
  });
});

// DELETE method to delete a student
app.delete('/students/:id', (req, res) => {
  const id = req.params.id;

  pool.getConnection((err, connection) => {
    if (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
      return;
    }

    connection.query(
      'DELETE FROM Students WHERE id = ?',
      [id],
      (error) => {
        connection.release();

        if (error) {
          console.error(error);
          res.status(500).send('Internal Server Error');
          return;
        }

        res.status(200).send('Student deleted successfully.');
      }
    );
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
