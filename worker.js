const { parentPort, workerData } = require("worker_threads");
const fs = require("fs");
const path = require("path");
const csv = require("fast-csv");

const mongoose = require("mongoose");
const Agent = require("./models/Agent");
const User = require("./models/User");

const inputFilePath = path.resolve(__dirname, "resources", "datasheet.csv");

/* async function readCsv(inputFilePath) {
    return new Promise((resolve, reject) => {
        var agent = [];

        try {
            csv
                .parse(inputFilePath, {
                    headers: true
                })
                .on("data", function (data) {
                    data['_id'] = new mongoose.Types.ObjectId();

                    agent.push(data);
                })
                .on("end", function () {
                    Agent.create(agent, function (err, documents) {
                        if (err) reject(err);
                    });
                    resolve(agent.length + ' agents have been successfully uploaded.');
                });
        } catch (error) {
            reject(error);
        }
    });
} */

const uri = "mongodb://localhost/test";
mongoose.Promise = global.Promise;

async function readCsv(inputFilePath) {
    const conn = await mongoose.connect(uri);
    await Promise.all(
      Object.entries(conn.models).map(([k, m]) => m.deleteOne())
    );
    let headers = Object.keys(Agent.schema.paths).filter(
      (k) => ["_id", "__v"].indexOf(k) === -1
    );

  return new Promise((resolve, reject) => {
    let data = [];

    csv
      .parseFile(inputFilePath)
      .on("error", reject)
      .on("data", (row) => {
        const agent = new Agent({
          agent: row[0],
        });

        agent.save(function (err) {
          if (err) return err;
          const user = new User({
            fisrtname: row[1],
            dob: row[2],
            address: row[3],
            phone: row[4],
            state: row[5],
            zip: row[6],
            email: row[7],
            userType: row[8],
            agent: agent._id,
          });
        });

        data.push(row)
                /* const obj = {agent : row['agent']}; */
                /* if (obj) data.push(obj); */
      })
      .on("end", async () => {
          
    
        Agent.insertMany(data)
          .then(async (value) => {
            await User.insertMany(data)
              .then((userValue) => {
                resolve(data);
              })
              .catch((error) => {
                console.log(error);
              });
          })
          .catch((error) => {
            console.log(error);
          });
        /* resolve(data); */
      });
  });
}

readCsv(inputFilePath)
  .then((data) => {
    console.log(data);
    parentPort.postMessage({ data: data });
  })
  .catch((err) => {
    console.log(err);
  });
