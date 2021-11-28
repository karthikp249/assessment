const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const { Worker, isMainThread, workerData } = require("worker_threads");
const mongoose = require("mongoose");
const multer = require("multer");

const routerPolicyInfo = require("./api/policyInfo");
const routerCreateJob = require("./api/createJob");


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./resources/");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + ".csv");
  },
});

const upload = multer({ storage: storage });

var uri = "mongodb://localhost:27017/test";

mongoose.connect(uri, { useUnifiedTopology: true, useNewUrlParser: true });

const connection = mongoose.connection;

connection.once("open", function () {
  console.log("MongoDB database connection established successfully");
});

let count = 0;
app.get("/", (req, res) => {
  count += 1;
  res.status(200).json({ counter: count });
});

app.post("/upload", upload.single("datasheet"), (req, res) => {
  const worker = new Worker("./worker.js", { workerData: { text: "hello" } });
  worker.on("message", (data) => {
    res.status(data.status).send(data.message);
  });
});

app.get("/api/policyInfo/", routerPolicyInfo);

app.post("/api/createJob/", routerCreateJob);

app.get("/heavy", (req, res) => {
  const worker = new Worker("./worker2");
  worker.on("message", (data) => {
    res.status(200).json({ total: data });
  });
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
