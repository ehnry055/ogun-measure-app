require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Sequelize, DataTypes } = require('sequelize');


const app = express();
const { auth } = require('express-oauth2-jwt-bearer');
const PORT = process.env.PORT || 4000;
app.use(cors());


const jwtCheck = auth({
  audience: 'https://racism-data-system.com/api',
  issuerBaseURL: 'https://dev-mqfq6kte0qw3b36u.us.auth0.com/',
  tokenSigningAlg: 'RS256'
});

// enforce on all endpoints
app.use(jwtCheck);

app.get('/authorized', function (req, res) {
    res.send('Secured Resource');
});

app.listen(port);

console.log('Running on port ', port);




const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'mysql',
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

sequelize.authenticate()
  .then(() => console.log('Connected to MySQL using Sequelize'))
  .catch(err => console.error('Error connecting to sql:', err));

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