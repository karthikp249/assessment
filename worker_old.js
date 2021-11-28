const { parentPort, workerData } = require("worker_threads");
const fs = require("fs");
const path = require("path");
const csv = require("fast-csv");

const mongoose = require("mongoose");

/* const { Agent,User,usersAccount,policyCategory,policyCarrier,policyInfo } = require('./models'); */
const Agent = require("./models/Agent");
const User = require("./models/User");
const usersAccount = require("./models/usersAccount");
const policyCarrier = require("./models/policyCarrier");
const policyCategory = require("./models/policyCategory");
const policyInfo = require("./models/policyInfo");

const inputFilePath = path.resolve(__dirname, "resources", "datasheet.csv");

/* async function fileRead(inputFilePath) {
    return new Promise((resolve, reject) => {
        fs.createReadStream(inputFilePath)
            .pipe(csv.parse({ headers: true }))
            .on('error', (error) => reject(error))
            .on('data', (row) => {console.log(typeof row)})
            .on('end', (rowCount) => resolve(rowCount));
    });
} */

const uri = "mongodb://localhost/test";
mongoose.Promise = global.Promise;
mongoose.set("debug", false);

/* const log = data => console.log(JSON.stringify(data, undefined, 2)); */

async function fileRead(inputFilePath) {
  try {
    const conn = await mongoose.connect(uri);

        await Promise.all(Object.entries(conn.models).map(([k, m]) => m.deleteMany()));

        /* let headers = Object.keys(Agent.schema.paths)
            .filter(k => ['_id', '__v'].indexOf(k) === -1); */



    await new Promise((resolve, reject) => {
      let buffer = [],
        counter = 0;

      let stream = fs
        .createReadStream(inputFilePath)
        .pipe(csv.parse({ headers: true, ignoreEmpty: true }))
        .on("error", reject)
        .on("data", async (doc) => {
          stream.pause();
          buffer.push(doc);
          
          counter++;
          /* console.log(counter); */
          //log(doc);
          try {
            if (counter > 10000) {
              /* The insert operation should be included here if the record set exceeds 10000*/
              buffer = [];
              counter = 0;
            }
          } catch (e) {
              console.error(e)
            stream.destroy(e);
            reject();
          }

          stream.resume();
        })
        .on("end", async () => {
          try {
            
            if (counter > 0) {
              /* console.log(await buffer[buffer.length-1]) */
              /* await User.insertMany(buffer); */
              let bufferLength = buffer.length;
              buffer.forEach((doc)=>{
                const agent = new Agent({
                  agent: doc["agent"],
                });

                agent.save(async function (err) {
                  if (err) return err;
                  const user = new User({
                    fisrtName: doc["firstname"],
                    dob: doc["dob"],
                    address: doc["address"],
                    phone: doc["phone"],
                    state: doc["state"],
                    gender: doc["gender"],
                    zip: doc["zip"],
                    email: doc["email"],
                    userType: doc["userType"],
                    agent: agent._id,
                  });
                  await user.save(async function (err) {
                    if (err) return err;
                    const users_account = new usersAccount({
                      accountName: doc["account_name"],
                      primary: doc["primary"],
                      applicantId: doc["ApplicantID"],
                      agencyId: doc["agency_id"],
                      hasActiveClientPolicy: doc["hasActive ClientPolicy"],
                      csr: doc["csr"],
                      producer: doc["producer"],
                      user: user._id,
                    });

                    await users_account.save(async (err) => {
                      if (err) return err;
                      const policy_category = new policyCategory({
                        categoryName: doc["category_name"],
                      });

                      await policy_category.save(async (err) => {
                        if (err) return err;
                        const policy_carrier = new policyCarrier({
                          companyName: doc["company_name"],
                        });
                        await policy_carrier.save(async (err) => {
                          if (err) return err;
                          const policy_info = new policyInfo({
                            policyNumber: doc["policy_number"],
                            policyStartDate: doc["policy_start_date"],
                            policyEndDate: doc["policy_end_date"],
                            policyMode: doc["policy_mode"],
                            premiumAmountWritten: doc["premium_amount_written"],
                            premiumAmount: doc["premium_amount"],
                            policyType: doc["policy_type"],
                            policyCategory: policy_category._id,
                            userId: user._id,
                            companyCollectionId: policy_carrier._id,
                          });

                          await policy_info.save(async (err) => {
                            if (err) return err;
                            console.log(bufferLength == buffer.length)
                            if(bufferLength == buffer.length){
                                buffer = [];
                                counter = 0;
                                return resolve("200");
                            }
                          });
                        });
                      });
                    });
                  });
                });
              });
              /* buffer = [];
              counter = 0; */
            }
          } catch (e) {
              console.error(e)
            stream.destroy(e);
            reject();
          }
        });
    });
return "resolve";
  } catch (e) {
    console.error(e);
    reject();
  } finally {
    process.exit();
  }
}

fileRead(inputFilePath)
  .then((data) => {
      console.log(data)
    parentPort.postMessage({ data: data });
  })
  .catch((err) => {
    parentPort.postMessage(err);
  });
