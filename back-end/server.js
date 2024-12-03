require('dotenv').config();

// back-end/server.js
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 4000;

// Enable CORS to allow requests from your React frontend
app.use(cors());

// Create MySQL connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL');
});

// API endpoint to fetch all notes
app.get('/api/notes', (req, res) => {
    console.log("hello world")
    db.query('SELECT * FROM notes', (err, results) => {
        if (err) {
            console.error('Error fetching notes:', err);
            return res.status(500).send('Error fetching notes');
        }
        res.json(results);
        console.log(results);
    });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
