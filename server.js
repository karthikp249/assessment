const express = require("express");
const bodyParser = require("body-parser");
const process = require("process");
const app = express();
const port = process.env.PORT || 3000;
const { Worker, isMainThread, workerData } = require("worker_threads");
const mongoose = require("mongoose");
const multer = require("multer");
const fs = require("fs");

const routerPolicyInfo = require("./api/policyInfo");
const routerPolicyAggregate = require("./api/policyAggregate");
const routerCreateJob = require("./api/createJob");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//console.log(isMainThread);

/**
 * Node server CPU utilization in real-time,
 * restarts on 70 percent CPU usage
 */
const usage = require("cpu-percentage");
var start = usage();
setInterval(() => {
  fs.readFile(__filename, "utf8", function (err, data) {
    if (usage(start).percent.toFixed(2) > 70) {
      fs.writeFileSync(
        "./restart.json",
        JSON.stringify({
          message:
            "App restart, CPU Usage (%): " +
            usage(start).percent.toFixed(2) +
            " at " +
            new Date(),
        })
      );
    }
  });
}, 1000);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./resources/");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + ".csv");
  },
});

const upload = multer({ storage: storage });

var uri = "mongodb://localhost:27017/assessmentKarthik";
mongoose.connect(uri, { useUnifiedTopology: true, useNewUrlParser: true });
const connection = mongoose.connection;
connection.once("open", function () {
  console.log("MongoDB database connection established successfully");
});


app.get("/", (req, res) => {
  res.status(200).send('Hello there!');
});

app.post("/upload", upload.single("datasheet"), (req, res) => {
  const worker = new Worker("./worker.js", { workerData: { text: "hello" } });
  worker.on("message", (data) => {
    res.status(data.status).send(data.message);
  });
});

app.get("/api/policyInfo/", routerPolicyInfo);
app.get("/api/policyAggregate/", routerPolicyAggregate);

app.post("/api/createJob/", routerCreateJob);

app.get("/heavy", (req, res) => {
  const worker = new Worker("./worker2.js");
  worker.on("message", (data) => {
    res.status(200).json({ total: data });
  });
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
