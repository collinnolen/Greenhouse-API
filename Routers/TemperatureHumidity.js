const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const LineReaderSync = require("line-reader-sync");

/**
 * Routes
 */
router.get("/Current", (req, res) => {
  let currentDateFiles = generateFileNames(new Date(), 0);
  let dataPoints = fetchData(currentDateFiles);
  let latestDataPoint = dataPoints[dataPoints.length - 1];

  return res.status(200).json(JSON.stringify(latestDataPoint));
});

router.get("/DaysBack/:daysBack", (req, res) => {
  let currentDateFiles = generateFileNames(new Date(), req.params.daysBack);
  let response = fetchData(currentDateFiles);

  return res.status(200).json(JSON.stringify(response));
});

/**
 * Functions
 */
function generateFileNames(startDate, daysBack) {
  let fileNames = [];

  while (daysBack != -1) {
    var date = new Date();
    date.setDate(date.getDate() - daysBack);

    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();

    if (day < 10) day = "0" + day;
    if (month < 10) month = "0" + month;

    console.log("Adding fileName: " + month + "-" + day + "-" + year + ".txt");
    fileNames.push(month + "-" + day + "-" + year + ".txt");
    daysBack -= 1;
  }

  return fileNames;
}

function fetchData(fileNames) {
  const datapoints = [];

  let pathToFiles = path.normalize(getConfig("pathToDataFiles"));

  //If debugging on windows PC use this path
  if (getConfig("debug"))
    pathToFiles = path.normalize(getConfig("debugPathToDataFiles"));

  fileNames.forEach(file => {
    if (fs.existsSync(pathToFiles + file)) {
      console.log("Reading file: " + pathToFiles + file);

      lrs = new LineReaderSync(pathToFiles + file);
      lines = lrs.toLines();

      lines.forEach(line => {
        datapoints.push(createTempuatureHumidityObject(line));
      });
    } else {
      console.log("Could not find file: " + pathToFiles + file);
    }
  });

  return datapoints;
}

function createTempuatureHumidityObject(objString) {
  let splitString = objString.split("\t");

  let tempHumidity = {};

  splitString.forEach(attribute => {
    let i = attribute.indexOf(":");
    let keyValuePair = [attribute.slice(0, i), attribute.slice(i + 1)];

    if (keyValuePair[0].toUpperCase().trim() == "TIMESTAMP") {
      tempHumidity.TimeStamp = keyValuePair[1].trim();
    } else if (keyValuePair[0].toUpperCase().trim() == "TEMP") {
      tempHumidity.Temperature = keyValuePair[1].trim();
    } else if (keyValuePair[0].toUpperCase().trim() == "HUMIDITY") {
      tempHumidity.Humidity = keyValuePair[1].trim();
    }
  });

  return tempHumidity;
}

function getConfig(configName) {
  let rawConfig = fs.readFileSync(
    path.normalize(path.join(__dirname + "/../config.json"))
  );
  let config = JSON.parse(rawConfig);

  return config[configName];
}

module.exports = router;
