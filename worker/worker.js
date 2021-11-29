const { parentPort,isMainThread, workerData } = require('worker_threads');
const fs = require('fs');
const path = require('path');
const csv = require('fast-csv');

const mongoose = require('mongoose');
const Agent = require('../models/Agent');
const User = require('../models/User');
const usersAccount = require('../models/usersAccount');
const policyCarrier = require('../models/policyCarrier');
const policyCategory = require('../models/policyCategory');
const policyInfo = require('../models/policyInfo');

//console.log(isMainThread)

const inputFilePath = path.resolve(__dirname, '../', 'resources', 'datasheet.csv');

const uri = 'mongodb://localhost/assessmentKarthik';

async function readCsv(inputFilePath) {
  const conn = await mongoose.connect(uri);
  await Promise.all(
    Object.entries(conn.models).map(([k, m]) => m.deleteMany())
  );

  return new Promise((resolve, reject) => {
    try {
      /* let data = []; */

      csv
        .parseFile(inputFilePath, { headers: true })
        .on('error', reject)
        .on('data', async (row) => {
          const agent = new Agent({
            agent: row['agent'],
          });

          agent.save(async function (err) {
            if (err)
              reject({ status: 502, message: 'Invalid response, Error' });
            const user = new User({
              firstName: row['firstname'],
              dob: row['dob'],
              address: row['address'],
              phone: row['phone'],
              state: row['state'],
              gender: row['gender'],
              zip: row['zip'],
              email: row['email'],
              userType: row['userType'],
              agent: agent._id,
            });
            await user.save(async function (err) {
              if (err)
                reject({ status: 502, message: 'Invalid response, Error' });
              const users_account = new usersAccount({
                accountName: row['account_name'],
                primary: row['primary'],
                applicantId: row['ApplicantID'],
                agencyId: row['agency_id'],
                hasActiveClientPolicy: row['hasActive ClientPolicy'],
                csr: row['csr'],
                producer: row['producer'],
                user: user._id,
              });

              await users_account.save(async (err) => {
                if (err)
                  reject({ status: 502, message: 'Invalid response, Error' });
                const policy_category = new policyCategory({
                  categoryName: row['category_name'],
                });

                await policy_category.save(async (err) => {
                  if (err)
                    reject({ status: 502, message: 'Invalid response, Error' });
                  const policy_carrier = new policyCarrier({
                    companyName: row['company_name'],
                  });
                  await policy_carrier.save(async (err) => {
                    if (err)
                      reject({
                        status: 502,
                        message: 'Invalid response, Error',
                      });
                    const policy_info = new policyInfo({
                      policyNumber: row['policy_number'],
                      policyStartDate: row['policy_start_date'],
                      policyEndDate: row['policy_end_date'],
                      policyMode: row['policy_mode'],
                      premiumAmountWritten: row['premium_amount_written'],
                      premiumAmount: row['premium_amount'],
                      policyType: row['policy_type'],
                      policyCategory: policy_category._id,
                      userId: user._id,
                      companyCollectionId: policy_carrier._id,
                    });

                    await policy_info.save(async (err) => {
                      if (err) {
                        reject({
                          status: 502,
                          message: 'Invalid response, Error',
                        });
                      }
                    });
                  });
                });
              });
            });
          });
        })
        .on('end', async () => {
          resolve({ status: 200, message: 'File upladed successfully' });
        });
    } catch (e) {
      console.error(e);
      reject({ status: 502, message: 'Invalid response, Error' });
    }
  });
}

readCsv(inputFilePath)
  .then((data) => {
    parentPort.postMessage(data);
  })
  .catch((err) => {
    parentPort.postMessage(err);
  });
