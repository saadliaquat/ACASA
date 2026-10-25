const express = require('express');
const pool = require('./db');  // import the pool from db.js
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { execFile } = require('child_process');





const app = express();
app.use(express.json()); 
app.use(cors({
    origin: "http://localhost:3000", // allow frontend to access the API
    methods: ["GET", "POST"]
  }));

// setting up multer for document uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const desktopPath =  path.join('C:', 'Users', 'saadl', 'Desktop', 'uploads')
    cb(null, desktopPath); 
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });


app.get("/", (req, res) => {
    res.json({ message: "Hello, CORS is working!" });
});

// register Route
app.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  console.log(username, email, password); 
  try {
    const result = await pool.query(
      'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *',
      [username, email, password]
    );
    res.status(201).json({ message: 'User created', user: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// login Route
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    // retrieve user by email
    const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = userResult.rows[0];
    if (user && user.password === password) { 
      res.json({ message: 'Login successful', user: user });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// endpoint for file upload
app.post('/upload', upload.single('document'), async (req, res) => {
  const { controlId } = req.body; // Control ID passed with the file
  const filePath = req.file.path;
  const fileName = req.file.filename;

  try {
    // insert document information into the database
    const result = await pool.query(
      'INSERT INTO documents (control_id, file_name, file_path) VALUES ($1, $2, $3) RETURNING *',
      [controlId, fileName, filePath]
    );

    res.status(200).json({
      message: 'File uploaded and processed successfully!',
      document: result.rows[0],
    });


  } catch (err) {
    console.error('Error uploading file', err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/employee_contract', async (req, res) => {
  const control_id = 2;
  try {
    // fetch document information from the database
    const result = await pool.query(
      "SELECT * FROM documents WHERE control_id = $1",
    [control_id],
    );
    
    //fetch latest row according to timestamp
    let row = result.rows[result.rows.length - 1]
    let filePath = row.file_path

    console.log("Script running")
    execFile('python', ['./scripts/employee_contracts.py', filePath], (error, stdout, stderr) => {
      if (error) {
        console.error('Error calling Python script:', error);
        return res.status(500).json({ message: 'Error processing file in Python' });
      }
      if (stderr) {
        console.error('Python script stderr:', stderr);
        return res.status(500).json({ message: 'Error in Python script execution' });
      }

      console.log('Python script output:', stdout);

      res.status(200).json({
        message: 'Employee contract file processed',
        pythonOutput: stdout
      });
    });

  } catch (err) {
    console.error('Error executing script', err);
    res.status(500).json({ message: 'Server error' });
  }
});


app.post('/afterterm_contract', async (req, res) => {
  const control_id = 5;
  try {
    // fetch document information from the database
    const result = await pool.query(
      "SELECT * FROM documents WHERE control_id = $1",
    [control_id],
    );
    
    //fetch latest row according to timestamp
    let row = result.rows[result.rows.length - 1]
    let filePath = row.file_path

    console.log("Script running")
    execFile('python', ['./scripts/afterterm_contracts.py', filePath], (error, stdout, stderr) => {
      if (error) {
        console.error('Error calling Python script:', error);
        return res.status(500).json({ message: 'Error processing file in Python' });
      }
      if (stderr) {
        console.error('Python script stderr:', stderr);
        return res.status(500).json({ message: 'Error in Python script execution' });
      }

      console.log('Python script output:', stdout);

      res.status(200).json({
        message: 'Employee after term contract file processed',
        pythonOutput: stdout
      });
    });

  } catch (err) {
    console.error('Error executing script', err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/nda_contract', async (req, res) => {

  const control_id = 6;
  try {
    // fetch document information into the database
    const result = await pool.query(
      "SELECT * FROM documents WHERE control_id = $1",
    [control_id],
    );
    
    //fetch latest row according to timestamp
    let row = result.rows[result.rows.length - 1]
    let filePath = row.file_path

    console.log("Script running")
    execFile('python', ['./scripts/NDA_contracts.py', filePath], (error, stdout, stderr) => {
      if (error) {
        console.error('Error calling Python script:', error);
        return res.status(500).json({ message: 'Error processing file in Python' });
      }
      if (stderr) {
        console.error('Python script stderr:', stderr);
        return res.status(500).json({ message: 'Error in Python script execution' });
      }

      console.log('Python script output:', stdout);

      res.status(200).json({
        message: 'Employee contract file processed',
        pythonOutput: stdout
      });
    });

  } catch (err) {
    console.error('Error uploading file', err);
    res.status(500).json({ message: 'Server error' });
  }
});




app.listen(8000, () => console.log('Server running on http://localhost:8000'));