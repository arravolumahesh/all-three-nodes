const express=require("express");
const sql=require("mssql");
const bodyParser=require("body-parser");
const app=express();

const Port=4000;

app.use(bodyParser.json());

const config={
    user:'sa',
    password:'mahesh201',
    server:'LAPTOP-EIJ4CSVR\SQLEXPRESS',
    database:'studentdata',
    options:{
        encrypt:true,
        enableArithAbort: true,
        trustedConnection:true
    },
};

app.get("/students",async(req,res)=>{
    try{
        const pool=await sql.connect(config);
        const result=await pool.request().query("select * from students");
        res.json(result.recordset);
    }catch(error){
        console.log(error);
        res.status(500).send("Internal server error");
    }
})

// POST method to add a new student
app.post('/students', async (req, res) => {
    const { name, age, grade } = req.body;
    if (!name || !age || !grade) {
      return res.status(400).send('Name, age, and grade are required.');
    }
  
    try {
      const pool = await sql.connect(config);
      await pool
        .request()
        .input('Name', sql.VarChar, name)
        .input('Age', sql.Int, age)
        .input('Grade', sql.VarChar, grade)
        .query('INSERT INTO Students (Name, Age, Grade) VALUES (@Name, @Age, @Grade)');
  
      res.status(201).send('Student added successfully.');
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  });
  
  // PUT method to update a student
  app.put('/students/:id', async (req, res) => {
    const studentId = req.params.id;
    const { name, age, grade } = req.body;
    if (!name || !age || !grade) {
      return res.status(400).send('Name, age, and grade are required.');
    }
  
    try {
      const pool = await sql.connect(config);
      await pool
        .request()
        .input('StudentId', sql.Int, studentId)
        .input('Name', sql.VarChar, name)
        .input('Age', sql.Int, age)
        .input('Grade', sql.VarChar, grade)
        .query('UPDATE Students SET Name = @Name, Age = @Age, Grade = @Grade WHERE StudentId = @StudentId');
  
      res.status(200).send('Student updated successfully.');
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  });
  
  // DELETE method to delete a student
  app.delete('/students/:id', async (req, res) => {
    const studentId = req.params.id;
  
    try {
      const pool = await sql.connect(config);
      await pool
        .request()
        .input('StudentId', sql.Int, studentId)
        .query('DELETE FROM Students WHERE StudentId = @StudentId');
  
      res.status(200).send('Student deleted successfully.');
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  });
  

app.listen(Port,()=>{
    console.log("server running on 4000")
})

