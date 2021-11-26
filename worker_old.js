const { parentPort, workerData } = require('worker_threads');
const fs = require('fs');
const path = require('path');
const csv = require('fast-csv');

const mongoose = require('mongoose');
const Agent = require('./models/Agent');
const User = require('./models/User');

const inputFilePath = path.resolve(__dirname, 'resources', 'datasheet.csv');

/* async function fileRead(inputFilePath) {
    return new Promise((resolve, reject) => {
        fs.createReadStream(inputFilePath)
            .pipe(csv.parse({ headers: true }))
            .on('error', (error) => reject(error))
            .on('data', (row) => {console.log(typeof row)})
            .on('end', (rowCount) => resolve(rowCount));
    });
} */

const uri = 'mongodb://localhost/test';
mongoose.Promise = global.Promise;
mongoose.set('debug', true);

/* const log = data => console.log(JSON.stringify(data, undefined, 2)); */

async function fileRead(inputFilePath) {

    try {
        const conn = await mongoose.connect(uri);

        await Promise.all(Object.entries(conn.models).map(([k, m]) => m.deleteOne()));

        let headers = Object.keys(Agent.schema.paths)
            .filter(k => ['_id', '__v'].indexOf(k) === -1);

       // console.log(headers);

        await new Promise((resolve, reject) => {

            let buffer = [],
                counter = 0;

            let stream = fs.createReadStream(inputFilePath)
                .pipe(csv.parse({ headers : true }))
                .on("error", reject)
                .on("data", async doc => {
                    stream.pause();
                    buffer.push(doc);
                    counter++;
                    //log(doc);
                    try {
                        if (counter > 10000) {
                            await Agent.insertMany(buffer);
                            await User.insertMany(buffer);
                            buffer = [];
                            counter = 0;
                        }
                    } catch (e) {
                        stream.destroy(e);
                    }

                    stream.resume();

                })
                .on("end", async () => {
                    try {
                        if (counter > 0) {
                            await Agent.insertMany(buffer);
                            await User.insertMany(buffer);
                            buffer = [];
                            counter = 0;
                            resolve(200);
                        }
                    } catch (e) {
                        stream.destroy(e);
                    }
                });

        });


    } catch (e) {
        console.error(e)
    } finally {
        process.exit()
    }


}

fileRead(inputFilePath).then((data) => {
    parentPort.postMessage({ data: data })
}).catch((err) => { parentPort.postMessage(err) });

