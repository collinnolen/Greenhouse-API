/**
 * Required External Modules
 */

const express = require("express");
const path = require("path");

/**
 * App Variables
 */

const app = express();
const port = process.env.PORT || "8001";

const TempHumidity = require(path.join(
  __dirname + "/Routers/TemperatureHumidity"
));
const FileManagement = require(path.join(
  __dirname + "/Routers/FileManagement"
));

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
