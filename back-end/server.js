require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Sequelize, DataTypes } = require('sequelize');

const app = express();
const PORT = process.env.PORT || 4000;
app.use(cors());

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'mysql',
});

const Note = sequelize.define('Note', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true, 
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  content: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  tableName: 'notes',
  timestamps: false, 
});

sequelize.authenticate()
  .then(() => console.log('Connected to MySQL using Sequelize'))
  .catch(err => console.error('Error connecting to MySQL:', err));

sequelize.sync();

app.get('/api/notes', async (req, res) => {
  try {
    const notes = await Note.findAll(); 
    console.log(notes)
    res.json(notes);
  } catch (err) {
    console.error('Error fetching notes:', err);
    res.status(500).send('Error fetching notes');
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});