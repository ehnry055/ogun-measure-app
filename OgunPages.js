const express = require('express');
const router = express.Router();
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize(process.env.JAWSDB_URL, { dialect: 'mysql' });

function defineNotesModel(tableName) {
  return sequelize.define(tableName, {
    rowTitle: { type: DataTypes.STRING, primaryKey: true },
    period1: { type: DataTypes.TEXT },
    period2: { type: DataTypes.TEXT },
    period3: { type: DataTypes.TEXT }
  }, {
    tableName,
    timestamps: false
  });
}

router.post('/save', async (req, res) => {
  const { pageId, tableData } = req.body;
  if (!pageId || !Array.isArray(tableData)) return res.status(400).send("Invalid request");

  const Table = defineNotesModel(`Notes_${pageId}`);

  try {
    await Table.sync(); // create table if not exists
    await Table.destroy({ where: {} }); // clear old data

    const rows = [
      { rowTitle: "Structural Violence", period1: tableData[0][0], period2: tableData[0][1], period3: tableData[0][2] },
      { rowTitle: "Limited or Restricted Access", period1: tableData[1][0], period2: tableData[1][1], period3: tableData[1][2] },
    ];

    await Table.bulkCreate(rows);
    res.status(200).send("Data saved");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error saving data");
  }
});

router.get('/load', async (req, res) => {
  const pageId = req.query.pageId;
  if (!pageId) return res.status(400).send("Missing pageId");

  const Table = defineNotesModel(`Notes_${pageId}`);

  try {
    await Table.sync(); // ensure table exists
    const rows = await Table.findAll();

    const tableData = rows.map(row => [row.period1, row.period2, row.period3]);
    res.json(tableData);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error loading data");
  }
});

module.exports = router;