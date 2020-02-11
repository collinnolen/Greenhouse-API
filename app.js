// index.js

/**
 * Required External Modules
 */

const express = require("express");
const TempHumidity = require("./routers/TemperatureHumidity");
const FileManagement = require("./routers/FileManagement");

/**
 * App Variables
 */

const app = express();
const port = process.env.PORT || "8001";

/**
 * Routes Definitions
 */

app.get("/", (req, res) => {
  res.status(200).send("Welcome to the Greenhouse API!");
});

app.use("/TempHumidity", TempHumidity);
app.use("/FileManagement", FileManagement);

/**
 * Server Activation
 */

app.listen(port, () => {
  console.log(`Listening to requests on http://localhost:${port}`);
});
