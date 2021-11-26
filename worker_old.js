const { parentPort, workerData } = require('worker_threads');
const fs = require('fs');
const path = require('path');
const csv = require('fast-csv');

const mongoose = require('mongoose');

/* const { Agent,User,usersAccount,policyCategory,policyCarrier,policyInfo } = require('./models'); */
const Agent = require("./models/Agent");
const User = require("./models/User");
const usersAccount = require("./models/usersAccount");
const policyCarrier = require("./models/policyCarrier");
const policyCategory = require("./models/policyCategory");
const policyInfo = require("./models/policyInfo");

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
mongoose.set('debug', false);

/* const log = data => console.log(JSON.stringify(data, undefined, 2)); */

async function fileRead(inputFilePath) {

    try {
        const conn = await mongoose.connect(uri);

/*         await Promise.all(Object.entries(conn.models).map(([k, m]) => m.deleteOne()));

        let headers = Object.keys(Agent.schema.paths)
            .filter(k => ['_id', '__v'].indexOf(k) === -1);

 */

        await new Promise((resolve, reject) => {

            let buffer = [],
                counter = 0;

            let stream = fs.createReadStream(inputFilePath)
                .pipe(csv.parse({ headers : true ,ignoreEmpty:true }))
                .on("error", reject)
                .on("data", async doc => {
                    stream.pause();
                    buffer.push(doc);
                    const agent = new Agent({
                      agent: doc['agent'],
                    });

                    agent.save(async function (err) {
                      if (err) return err;
                      const user = new User({
                        fisrtname: doc['firstname'],
                        dob: doc['dob'],
                        address: doc['address'],
                        phone: doc['phone'],
                        state: doc['state'],
                        zip: doc['zip'],
                        email: doc['email'],
                        userType: doc['userType'],
                        agent: agent._id,
                      });
                      await user.save(async function (err){
                          if (err) return err;
                          const users_account = new usersAccount({
                            accountName : doc['account_name'],
                            user : user._id
                          });
                          
                          await users_account.save(async (err)=>{
                              if (err) return err;
                              const policy_category = new policyCategory({
                                categoryName :  doc['category_name']
                              });

                              await policy_category.save(async (err)=>{
                                if(err) return err;
                                const policy_carrier = new policyCarrier({
                                    companyName : doc['company_name']
                                });
                                await policy_carrier.save(async (err)=>{
                                    if(err) return err;
                                    const policy_info = new policyInfo({
                                      policyNumber: doc["policy_number"],
                                      policyStartDate: doc["policy_start_date"],
                                      policyEndDate: doc["policy_end_date"],
                                      policyCategory: policy_category._id,
                                      userId: user._id,
                                      companyCollectionId: policy_carrier._id,
                                    });

                                    await policy_info.save(async (err)=>{
                                        if(err) return err;
                                        
                                    })
                                })
                              });
                          });
                      });
                    });
                    counter++;
                    //log(doc);
                    try {
                        if (counter > 10000) {
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

