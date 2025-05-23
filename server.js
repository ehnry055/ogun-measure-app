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

// const ogunPagesRouter = require('./OgunPages');
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
  MM_LRA1: { type: Sequelize.DataTypes.INTEGER }
}, {
  tableName: 'AggregatedData',
  timestamps: false
});

let DynamicEntry = AggregatedData;

const upload = multer({ dest: 'uploads/' });

sequelize.authenticate()
  .then(() => console.log('Connected to MySQL using Sequelize'))
  .catch(err => console.error('Error connecting to sql:', err));

sequelize.sync();

// list all tables in the database
app.get('/api/tables', async (req, res) => {
  try {
    const [tables] = await sequelize.query("SHOW TABLES");
    const key = `Tables_in_${sequelize.config.database}`;
    const tableNames = tables
      .map(row => row[key])
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

  try {
    const [tables] = await sequelize.query("SHOW TABLES");
    const key = `Tables_in_${sequelize.config.database}`;
    const tableExists = tables.some(row => row[key] === tableName);
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
  if (!/^[a-zA-Z0-9_]+$/.test(tableName)) return res.status(400).send("Invalid table name");
  if (tableName === 'AggregatedData') return res.status(403).send("Cannot delete this table.");
  
  const [tables] = await sequelize.query("SHOW TABLES");
  const key = `Tables_in_${sequelize.config.database}`;
  const tableExists = tables.some(row => row[key] === tableName);
  if (!tableExists) return res.status(404).send("Table not found");

  try {
    await sequelize.query(`DROP TABLE IF EXISTS \`${tableName}\``);
    // if the deleted table is currently active, reset DynamicEntry to the default table.
    if (DynamicEntry && DynamicEntry.getTableName() === tableName) DynamicEntry = AggregatedData;
    res.status(200).send(`Table ${tableName} dropped successfully`);
  } catch (err) {
    console.error('Error deleting table:', err);
    res.status(500).send('Error deleting table');
  }
});

app.get('/api/notes', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
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
    const attributes = columns.length > 0 ? columns : undefined;

    const data = await DynamicEntry.findAll({
      attributes: attributes // include only selected columns
    });

    if (data.length === 0) {
      return res.status(404).send('No data found');
    }

    // get all column names from model if no columns specified
    const fields = attributes || Object.keys(data[0].dataValues);
    
    const parser = new Parser({ fields });
    const csv = parser.parse(data);

    res.header('Content-Type', 'text/plain');
    res.header('Content-Disposition', 'inline; filename="filtered_data.csv"');
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

  console.log('Upload started for:', tableName); // Debug 1

  // Validation
  if (!tableName) {
    fs.unlinkSync(filePath);
    return res.status(400).send('No table name');
  }
  if (!/^[a-zA-Z0-9_]+$/.test(tableName)) {
    fs.unlinkSync(filePath);
    return res.status(400).send('Invalid table name');
  }

  try {
    // 1. Drop table (if exists)
    console.log('Dropping table...'); // Debug 2
    await sequelize.query(`DROP TABLE IF EXISTS \`${tableName}\``);
    
    // 2. Read CSV headers
    console.log('Reading headers...'); // Debug 3
    const headers = await new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csv())
        .on('headers', resolve)
        .on('error', reject);
    });

    // 3. Create table
    console.log('Creating table with headers:', headers); // Debug 4
    await sequelize.query(`
      CREATE TABLE \`${tableName}\` (
        ${headers.map(h => `\`${h}\` TEXT`).join(', ')}
      )
    `);

    // 4. Insert data
    console.log('Inserting data...'); // Debug 5
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
      
      console.log('Executing INSERT query...'); // Debug 6
      await sequelize.query(`
        INSERT INTO \`${tableName}\` (${columns})
        VALUES ${values}
      `);
    }

    // 5. Cleanup
    fs.unlinkSync(filePath);
    console.log('Upload completed successfully'); // Debug 7
    res.status(200).send('Upload successful');
  } catch (err) {
    console.error('Upload error:', err); // Debug 8
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

/*

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





  //email sending funtions
  const sendEmail = ({ email, role, affiliation, funding, intention, share, when, area, target, data }) => {
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
        subject: `Request for Data Access by ${email}`,
        html: `
          <p>Name: ${email}</p>
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
          <p>Name: ${email}</p>
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
/*
var management = new ManagementClient({
  client_id: process.env.REACT_APP_AUTH0_clientId,
  client_secret: process.env.REACT_APP_AUTH0_SECRET,
  domain: process.env.REACT_APP_AUTH0_domain
});

const userList = await management.users.getAll();

app.get("/v2/admin/get-users",  async (req, res) => {
  try {
    res.json(userList);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).send('Error fetching users');
  }
});
*/

// Catch-all handler for any other requests
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'front-end/build', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});