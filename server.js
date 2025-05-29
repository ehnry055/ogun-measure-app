require('dotenv').config();
const { ManagementClient } = require('auth0').ManagementClient;
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
const port = process.env.PORT || 4000;
const { Parser } = require('json2csv');
const nodemailer = require('nodemailer');
const auth0Management = require('./auth0');
const { table } = require('console');
const { Op } = require('sequelize');

// const ogunPagesRouter = require('./ogun_pagess');
// app.use('/api/ogun-pages', ogunPagesRouter);

const corsOptions = {
  origin: [
    'http://localhost:4000', 
    'https://ogun-measure-app.herokuapp.com'
  ],
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());

app.use(express.static(path.join(__dirname, 'front-end/build')));

app.get('/api', (req, res) => {
  res.json({ message: 'Hello from the server!' });
});

const sequelize = new Sequelize(process.env.JAWSDB_URL, {
  dialect: 'mysql',
});

const AggregatedData = sequelize.define('AggregatedData', {
  STATE: { type: Sequelize.DataTypes.STRING },
  STATEICP: { type: Sequelize.DataTypes.INTEGER },
  STATEFIPS: { type: Sequelize.DataTypes.INTEGER },
  GISJOIN: { type: Sequelize.DataTypes.STRING, primaryKey: true },
  COUNTYFIPS: { type: Sequelize.DataTypes.INTEGER },
  ALLCOUNTIES: { type: Sequelize.DataTypes.STRING },
  RSG_SV1: { type: Sequelize.DataTypes.INTEGER },
  RSG_LRA1: { type: Sequelize.DataTypes.INTEGER },
  RSG_SV2: { type: Sequelize.DataTypes.INTEGER },
  PO_LRA2: { type: Sequelize.DataTypes.INTEGER },
  GR_SV1: { type: Sequelize.DataTypes.INTEGER },
  GR_SV2: { type: Sequelize.DataTypes.INTEGER },
  GR_LRA2: { type: Sequelize.DataTypes.INTEGER },
  PI_SV1: { type: Sequelize.DataTypes.INTEGER },
  PI_SV2: { type: Sequelize.DataTypes.INTEGER },
  PI_LRA3: { type: Sequelize.DataTypes.INTEGER },
  IP_SV3: { type: Sequelize.DataTypes.INTEGER },
  OSU_SV1: { type: Sequelize.DataTypes.INTEGER },
  OSU_LRA1: { type: Sequelize.DataTypes.INTEGER },
  OSU_SV2: { type: Sequelize.DataTypes.INTEGER },
  HCA_SV3: { type: Sequelize.DataTypes.INTEGER },
  HFA_SV2: { type: Sequelize.DataTypes.INTEGER },
  HFA_LRA2: { type: Sequelize.DataTypes.INTEGER },
  HFA_SV3: { type: Sequelize.DataTypes.INTEGER },
  HFA_LRA3: { type: Sequelize.DataTypes.INTEGER },
  MM_LRA1: { type: Sequelize.DataTypes.INTEGER },
}, {
  tableName: 'AggregatedData',
  timestamps: false,
  id: false
});

const ogun_pages = sequelize.define('ogun_pages', {
  pageId: {
    type: DataTypes.STRING,
    primaryKey: true
  },
  content: {
    type: DataTypes.JSON,
    allowNull: false
  }
}, {
  tableName: 'ogun_pages',
  timestamps: true,
  updatedAt: 'last_modified',
  createdAt: false
});

let DynamicEntry = AggregatedData;

const upload = multer({ dest: 'uploads/' });

sequelize.authenticate()
  .then(() => console.log('Connected to MySQL using Sequelize'))
  .catch(err => console.error('Error connecting to sql:', err));

sequelize.sync()
  .then(() => console.log('All models synchronized'))
  .catch(err => console.error('Error syncing models:', err));

// list all tables in the database
app.get('/api/tables', async (req, res) => {
  try {
    const [tables] = await sequelize.query("SHOW TABLES");
    const key = `Tables_in_${sequelize.config.database}`;
    const tableNames = tables
      .map(row => row[key])
      .filter(name => name !== 'ogun_pages' && name !== 'OgunPage'); 
    res.json(tableNames);
  } catch (err) {
    console.error('Error fetching tables:', err);
    res.status(500).send('Error fetching tables');
  }
});

// select which table to look at
app.post('/api/select-table', async (req, res) => {
  const tableName = req.body.tableName;
  if (!tableName) return res.status(400).send("No table name provided");

  if (tableName === 'ogun_pages' || tableName === 'OgunPage') {
    return res.status(404).send("Table not found");
  }

  try {
    const [tables] = await sequelize.query("SHOW TABLES");
    const key = `Tables_in_${sequelize.config.database}`;

    // filter out ogun_pages from the tables list
    const filteredTables = tables
      .map(row => row[key])
      .filter(name => name !== 'ogun_pages' && name !== 'OgunPage');

    const tableExists = filteredTables.includes(tableName);
    if (!tableExists) return res.status(404).send("Table not found");

    // fetch column names AND data types
    const [columns] = await sequelize.query(`
      SELECT COLUMN_NAME, DATA_TYPE 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_NAME = '${tableName}'
    `);

    // map SQL data types to Sequelize types
    const attributes = columns.reduce((acc, col) => {
      acc[col.COLUMN_NAME] = {
        type: mapDataType(col.DATA_TYPE) // Map to Sequelize type
      };
      return acc;
    }, {});

    // remove existing model if it exists
    if (sequelize.models[tableName]) {
      delete sequelize.models[tableName];
    }

    // define the model with correct data types
    DynamicEntry = sequelize.define(tableName, attributes, {
      tableName: tableName,
      timestamps: false,
      id: false
    });

    res.status(200).send(`Dynamic table set to ${tableName}`);
  } catch (err) {
    console.error('Error selecting table:', err);
    res.status(500).send('Error selecting table');
  }
});

// helper function to map SQL data types to Sequelize
function mapDataType(sqlType) {
  const typeMap = {
    'int': Sequelize.INTEGER,
    'varchar': Sequelize.STRING,
    'text': Sequelize.TEXT,
    'tinyint': Sequelize.BOOLEAN,
    'datetime': Sequelize.DATE,
    'float': Sequelize.FLOAT,
    'double': Sequelize.DOUBLE,
  };
  return typeMap[sqlType.toLowerCase()] || Sequelize.TEXT; // Default to TEXT
}

app.post('/api/delete-table', async (req, res) => {
  const tableName = req.body.tableName;
  if (!tableName) return res.status(400).send("No table name provided");
  if (!/^[\w.]+$/.test(tableName)) {
    return res.status(400).send("Invalid table name. Only letters, numbers, underscores and periods are allowed.");
  }
  
  // block protected tables
  if (tableName === 'AggregatedData' || tableName === "ogun_pages" || tableName === "OgunPage") {
    return res.status(403).send("Cannot delete this table.");
  }

  try {
    const [tables] = await sequelize.query("SHOW TABLES");
    const key = `Tables_in_${sequelize.config.database}`;
    
    const tableNames = tables.map(row => row[key]);
    
    const tableExists = tableNames.includes(tableName);
    
    if (!tableExists) return res.status(404).send("Table not found");

    await sequelize.query(`DROP TABLE IF EXISTS \`${tableName}\``);
    
    if (DynamicEntry && DynamicEntry.getTableName() === tableName) {
      DynamicEntry = AggregatedData;
    }
    
    res.status(200).send(`Table ${tableName} dropped successfully`);
  } catch (err) {
    console.error('Error deleting table:', err);
    res.status(500).send('Error deleting table');
  }
});

app.get('/api/notes', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    const state = req.query.state;

    const options = {
      limit,
      attributes: { exclude: ['id'] }
    };
    
    if (state) {
      options.where = {
        STATE: {
          [Sequelize.Op.like]: `%${state}%`
        }
      };
    }

    const notes = await DynamicEntry.findAll({
      limit,
      attributes: { 
        exclude: ['id'] // forcefully exclude 'id' from queries
      }
    });
    res.json(notes);
  } catch (err) {
    console.error('Error fetching notes:', err);
    res.status(500).send('Error fetching notes');
  }
});

app.get('/api/export-csv', async (req, res) => {
  try {
    const columns = req.query.columns ? req.query.columns.split(',') : [];
    
    // always use columns from the CURRENT dynamic table if none are specified
    const attributes = columns.length > 0 
      ? columns 
      : Object.keys(DynamicEntry.rawAttributes); 

    const filteredAttributes = attributes.filter(attr => attr !== 'id');

    const data = await DynamicEntry.findAll({
      attributes: filteredAttributes
    });

    if (data.length === 0) {
      return res.status(404).send('No data found');
    }

    const parser = new Parser({ fields: filteredAttributes });
    const csv = parser.parse(data);

    res.header('Content-Type', 'text/csv');
    res.attachment('data.csv');
    res.send(csv);
  } catch (err) {
    console.error('Export error:', err);
    res.status(500).send('Error generating CSV');
  }
});

app.post('/api/upload', upload.single('csv'), async (req, res) => {
  if (!req.file) return res.status(400).send('No file uploaded');
  const tableName = req.body.tableName;
  const filePath = req.file.path;
  
  if (!tableName) {
    fs.unlinkSync(filePath);
    return res.status(400).send('No table name');
  }

  if (!/^[\w.]+$/.test(tableName)) {
    fs.unlinkSync(filePath);
    return res.status(400).send('Invalid table name');
  }

  try {
    await sequelize.query(`DROP TABLE IF EXISTS \`${tableName}\``);
    
    const headers = await new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csv())
        .on('headers', resolve)
        .on('error', reject);
    });

    await sequelize.query(`
      CREATE TABLE \`${tableName}\` (
        ${headers.map(h => `\`${h}\` TEXT`).join(', ')}
      )
    `);

    const results = await new Promise((resolve, reject) => {
      const rows = [];
      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', row => rows.push(row))
        .on('end', () => resolve(rows))
        .on('error', reject);
    });

    if (results.length > 0) {
      const columns = headers.map(h => `\`${h}\``).join(', ');
      const values = results.map(row => 
        `(${headers.map(h => row[h] ? sequelize.escape(row[h]) : 'NULL').join(', ')})`
      ).join(', ');
      
      await sequelize.query(`
        INSERT INTO \`${tableName}\` (${columns})
        VALUES ${values}
      `);
    }

    if (sequelize.models[tableName]) {
      delete sequelize.models[tableName];
    }
    
    const [columns] = await sequelize.query(`
        SELECT COLUMN_NAME 
        FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE TABLE_NAME = '${tableName}'
      `);

    DynamicEntry = sequelize.define(tableName, 
      columns.reduce((acc, col) => {
        acc[col.COLUMN_NAME] = { type: Sequelize.TEXT };
        return acc;
      }, {}), 
      {
        tableName: tableName,
        timestamps: false
      }
    );

    fs.unlinkSync(filePath);
    res.status(200).send('Upload successful');
  } catch (err) {
    fs.unlinkSync(filePath);
    res.status(500).send('Upload failed: ' + err.message);
  }
});


app.get('/api/columns', async (req, res) => {
  try {
    const columns = Object.keys(DynamicEntry.rawAttributes).map(columnName => ({
      name: columnName,
      type: DynamicEntry.rawAttributes[columnName].type.key
    }));
    res.json(columns);
  } catch (err) {
    console.error('Columns error:', err);
    res.status(500).send('Error fetching columns');
  }
});

// facets functions
app.post('/api/ogun-pages/save', async (req, res) => {
  try {
    const { pageId, tableData } = req.body;
    
    await ogun_pages.upsert({
      pageId: pageId,
      content: tableData
    });

    res.status(200).json({ message: 'Content saved successfully' });
  } catch (err) {
    console.error('Save error:', err);
    res.status(500).send('Error saving content');
  }
});

app.get('/api/ogun-pages/load', async (req, res) => {
  try {
    const { pageId } = req.query;
    const page = await ogun_pages.findByPk(pageId);
    
    if (page) {
      res.json(page.content);
    } else {
      res.status(404).send('Page not found');
    }
  } catch (err) {
    console.error('Load error:', err);
    res.status(500).send('Error loading content');
  }
});

  //email sending funtions
  const sendEmail = ({ email, name, role, affiliation, funding, intention, share, when, area, target, data }) => {
    console.log("Sending email with the following data:")
    return new Promise((resolve, reject) => {
      const transporter = nodemailer.createTransport({
        service: "Gmail",
        host: "smtp.gmail.com",
        port: 587,
        auth: {
          user: process.env.EMAIL_USER, // Your verified email address
          pass: process.env.EMAIL_PASS, // App-specific password
        },
      });
  
      const sendMailData = {
        from: process.env.EMAIL_USER, // Your verified email address
        to: process.env.EMAIL_USER, // Send the email to yourself
        subject: `Request for Data Access by ${name}`,
        html: `
          <p>Name: ${name}</p>
          <p>Email: ${email}</p>
          <p>Role: ${role}</p>
          <p>Affiliation: ${affiliation}</p>
          <p>Funding Source: ${funding}</p>
          <p>Data Use Intentions: ${intention}</p>
          <p>How and when will you share your findings with community members and organizations?: ${share}</p>
          <p>When will you complete the final document based on this research?: ${when}</p>
          <p>Which geographic area of the US are you interested in exploring?: ${area}</p>
          <p>Target Population: ${target}</p>
          <p>Data analysis program: ${data}</p>
        `,
      };
      
      const confirmMailData = {
        from: process.env.EMAIL_USER, // Your verified email address
        to: email, // Send the confirmation email to the user
        subject: "Confirmation of Data Access Request",
        html: `
          <p>Thank you for your request for data access.</p>
          <p>Name: ${name}</p>
          <p>Email: ${email}</p>
          <p>Role: ${role}</p>
          <p>Affiliation: ${affiliation}</p>
          <p>Funding Source: ${funding}</p>
          <p>Data Use Intentions: ${intention}</p>
          <p>How and when will you share your findings with community members and organizations?: ${share}</p>
          <p>When will you complete the final document based on this research?: ${when}</p>
          <p>Which geographic area of the US are you interested in exploring?: ${area}</p>
          <p>Target Population: ${target}</p>
          <p>Data analysis program: ${data}</p>
        `,
      };
      
      transporter.sendMail(sendMailData, (err, info) => {
        if (err) {
          return reject(err); // Reject the promise with the error
        }
        resolve(info); // Resolve the promise with the info
      });
      
      transporter.sendMail(confirmMailData, (err, info) => {
        if (err) {
          return reject(err); // Reject the promise with the error
        }
        resolve(info); // Resolve the promise with the info
      });
      
    });
  };

  app.get("/api/user/send-email", (req, res) => {
    sendEmail(req.query)
      .then((response) => res.send(response.message))
      .catch((error) => res.status(500).send(error.message));
  });

// auth0 management api

app.get("/admin/get-users",  async (req, res) => {
  try {
    const userList = await auth0Management.getAllUsers();
    res.json(userList);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).send('Error fetching users');
  }
});

// Catch-all handler for any other requests
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'front-end/build', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});