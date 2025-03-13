require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Sequelize, DataTypes } = require('sequelize');
const { auth } = require('express-oauth2-jwt-bearer');
const axios = require('axios');
const qs = require('qs');
const multer = require('multer');
const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');
const mysql = require('mysql2/promise');
const app = express();
const PORT = process.env.PORT || 4000;
const { Parser } = require('json2csv');


app.use(cors());
app.use(express.json());

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'mysql',
  dialectOptions: {
    localInfile: true,
    flags: ['+LOCAL_FILES'] // required for LOAD DATA LOCAL INFILE query (extra security)
  }
});

const TempEntry = sequelize.define('TempEntry', {
  STATE: { type: DataTypes.STRING },
  STATEICP: { type: DataTypes.INTEGER },
  STATEFIPS: { type: DataTypes.INTEGER },
  GISJOIN: { type: DataTypes.STRING, primaryKey: true },
  COUNTYFIPS: { type: DataTypes.INTEGER },
  ALLCOUNTIES: { type: DataTypes.STRING },
  RSG_SV1: { type: DataTypes.INTEGER },
  RSG_LRA1: { type: DataTypes.INTEGER },
  RSG_SV2: { type: DataTypes.INTEGER },
  PO_LRA2: { type: DataTypes.INTEGER },
  GR_SV1: { type: DataTypes.INTEGER },
  GR_SV2: { type: DataTypes.INTEGER },
  GR_LRA2: { type: DataTypes.INTEGER },
  PI_SV1: { type: DataTypes.INTEGER },
  PI_SV2: { type: DataTypes.INTEGER },
  PI_LRA3: { type: DataTypes.INTEGER },
  IP_SV3: { type: DataTypes.INTEGER },
  OSU_SV1: { type: DataTypes.INTEGER },
  OSU_LRA1: { type: DataTypes.INTEGER },
  OSU_SV2: { type: DataTypes.INTEGER },
  HCA_SV3: { type: DataTypes.INTEGER },
  HFA_SV2: { type: DataTypes.INTEGER },
  HFA_LRA2: { type: DataTypes.INTEGER },
  HFA_SV3: { type: DataTypes.INTEGER },
  HFA_LRA3: { type: DataTypes.INTEGER },
  MM_LRA1: { type: DataTypes.INTEGER }
}, {
  tableName: 'temp',
  timestamps: false
});

const Note = sequelize.define('Entry', {
  STATE: { type: DataTypes.STRING },
  STATEICP: { type: DataTypes.INTEGER },
  STATEFIPS: { type: DataTypes.INTEGER },
  GISJOIN: { type: DataTypes.STRING, primaryKey: true },
  COUNTYFIPS: { type: DataTypes.INTEGER },
  ALLCOUNTIES: { type: DataTypes.STRING },
  RSG_SV1: { type: DataTypes.INTEGER },
  RSG_LRA1: { type: DataTypes.INTEGER },
  RSG_SV2: { type: DataTypes.INTEGER },
  PO_LRA2: { type: DataTypes.INTEGER },
  GR_SV1: { type: DataTypes.INTEGER },
  GR_SV2: { type: DataTypes.INTEGER },
  GR_LRA2: { type: DataTypes.INTEGER },
  PI_SV1: { type: DataTypes.INTEGER },
  PI_SV2: { type: DataTypes.INTEGER },
  PI_LRA3: { type: DataTypes.INTEGER },
  IP_SV3: { type: DataTypes.INTEGER },
  OSU_SV1: { type: DataTypes.INTEGER },
  OSU_LRA1: { type: DataTypes.INTEGER },
  OSU_SV2: { type: DataTypes.INTEGER },
  HCA_SV3: { type: DataTypes.INTEGER },
  HFA_SV2: { type: DataTypes.INTEGER },
  HFA_LRA2: { type: DataTypes.INTEGER },
  HFA_SV3: { type: DataTypes.INTEGER },
  HFA_LRA3: { type: DataTypes.INTEGER },
  MM_LRA1: { type: DataTypes.INTEGER }
  }, {
  tableName: 'AggregatedData',
  timestamps: false
});

const upload = multer({ dest: 'uploads/' });

sequelize.authenticate()
  .then(() => console.log('Connected to MySQL using Sequelize'))
  .catch(err => console.error('Error connecting to sql:', err));

sequelize.sync();

app.get('/api/notes', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10; // default: 10 entries
    const notes = await TempEntry.findAll({ limit }); // adding LIMIT keyword to the query
    console.log(notes);
    res.json(notes);
  } catch (err) {
    console.error('Error fetching notes:', err);
    res.status(500).send('Error fetching notes');
  }
});

app.get('/api/export-csv', async (req, res) => {
  try {
    const data = await TempEntry.findAll();
    
    if (data.length === 0) {
      return res.status(404).send('No data found');
    }

    const fields = Object.keys(data[0].dataValues);
    const parser = new Parser({fields});
    const csv = parser.parse(data);

    res.header('Content-Type', 'text/plain');
    res.header('Content-Disposition', 'inline; filename="temp_data.csv"');
    res.send(csv);
    
  } catch (err) {
    console.error('Export error:', err);
    res.status(500).send('Error generating CSV');
  }
});

app.post('/api/upload', upload.single('csv'), async (req, res) => {
  if (!req.file) return res.status(400).send('No file uploaded');
  
  const results = [];
  const filePath = req.file.path;

  try {
    await new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', resolve)
        .on('error', reject);
    });

    await TempEntry.bulkCreate(results, {
      validate: true,
      ignoreDuplicates: true
    });

    fs.unlinkSync(filePath);
    res.status(200).send(`Inserted ${results.length} records`);

  } catch (err) {
    console.error('Upload error:', err);
    fs.unlinkSync(filePath);
    res.status(500).send('Error processing file');
  }
});

/*
import { ManagementClient } from 'auth0';

var management = new ManagementClient({
  domain: process.env.REACT_APP_AUTH0_domain + '.auth0.com',
  clientId: process.env.REACT_APP_AUTH0_clientId,
  clientSecret: process.env.REACT_APP_AUTH0_SECRET,
});

const allUsers = [];
let page = 0;
while (true) {
  const {
    data: { users, total },
  } = await management.users.getAll({
    include_totals: true,
    page: page++,
  });
  allUsers.push(...users);
  if (allUsers.length === total) {
    break;
  }
} */

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});