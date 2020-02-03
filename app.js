// index.js

/**
 * Required External Modules
 */

const express = require("express");
const path = require("path");
const LineReaderSync = require("line-reader-sync");
const fs = require("fs");

/**
 * App Variables
 */

const app = express();
const port = process.env.PORT || "8000";
const debug = true;

/**
 * Routes Definitions
 */

app.get("/", (req, res) => {
  res.status(200).send("Welcome to the Greenhouse API!");
});

app.get("/Current/", (req, res) => {
  let currentDateFiles = fetchFileNames(new Date(), 0);
  let response = getFileData(currentDateFiles);

  return res
    .status(200)
    .json(JSON.stringify(response.DataPoints[response.DataPoints.length - 1]));
});

app.get("/DaysBack/:daysBack", (req, res) => {
  let currentDateFiles = fetchFileNames(new Date(), req.params.daysBack);

  let response = getFileData(currentDateFiles);

  return res.status(200).json(JSON.stringify(response));
});

/**
 * Functions
 */
function fetchFileNames(startDate, daysBack) {
  let fileNames = [];

  while (daysBack != -1) {
    var date = new Date();
    date.setDate(date.getDate() - daysBack);

    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();

    if (day < 10) day = "0" + day;
    if (month < 10) month = "0" + month;

    console.log(day + "-" + month + "-" + year);
    fileNames.push(day + "-" + month + "-" + year);
    daysBack -= 1;
  }

  return fileNames;
}

function getFileData(fileNames) {
  const response = {};
  response.DataPoints = [];

  let path = "/media/usb/";

  //If debugging on windows PC use this path
  if (debug) path = `C:\\Users\\colli\\Workspace\\testing\\`;

  fileNames.forEach(file => {
    if (fs.existsSync(path + file + ".txt")) {
      lrs = new LineReaderSync(path + file + ".txt");
      lines = lrs.toLines();

      lines.forEach(line => {
        response.DataPoints.push(createTempuatureHumidityObject(line));
      });
    }
  });

  return response;
}

function createTempuatureHumidityObject(objString) {
  let tabDilimited = objString.split("\t");

  let obj = {};

  obj.TimeStamp = tabDilimited[0].split(":")[1];
  obj.Temperature = tabDilimited[1].split(":")[1];
  obj.Humidity = tabDilimited[2].split(":")[1];

  return obj;
}

/**
 * Server Activation
 */

app.listen(port, () => {
  console.log(`Listening to requests on http://localhost:${port}`);
});
