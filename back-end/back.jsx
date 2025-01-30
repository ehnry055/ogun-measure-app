const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors()); // Allow frontend to access the API

app.get("/api/chart-data", (req, res) => {
  const chartData = {
    title: "Sample Chart",
    series: [
      {
        name: "Values",
        data: [10, 20, 30, 40, 50],
      },
    ],
  };
  res.json(chartData);
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
