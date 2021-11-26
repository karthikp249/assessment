const { parentPort, workerData } = require('worker_threads');
const fs = require('fs');
const path = require('path');
const csv = require('fast-csv');

const mongoose = require('mongoose');
const Agent = require('./models/Agent');

const inputFilePath = path.resolve(__dirname, 'resources', 'datasheet.csv');

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


function readCsv(inputFilePath) {
    return new Promise((resolve, reject) => {
        const data = [];

        csv.parseFile(inputFilePath)
            .on("error", reject)
            .on("data", (row) => {
                data.push({agent : row[0]})
                const obj = {agent : row['agent']};
                if (obj) data.push(obj);
            })
            .on("end", () => {
                resolve(data);
            });
    });
}



readCsv(inputFilePath).then((data) => {
    console.log(data)
    parentPort.postMessage({ data: data })
}).catch((err) => { console.log(err) });