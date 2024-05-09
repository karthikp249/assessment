const { parentPort } = require('worker_threads');
const path = require('path');
const csv = require('fast-csv');
const mongoose = require('mongoose');

const Agent = require('../models/Agent');
const User = require('../models/User');
const UsersAccount = require('../models/UsersAccount');
const PolicyCarrier = require('../models/PolicyCarrier');
const PolicyCategory = require('../models/PolicyCategory');
const PolicyInfo = require('../models/PolicyInfo');

const inputFilePath = path.resolve(__dirname, '../resources', 'datasheet.csv');
const uri = 'mongodb://localhost/assessmentKarthik';

// Establish a MongoDB connection
async function connectDB() {
  return mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}

// Reset database
async function resetDatabase() {
  const conn = await connectDB();
  return Promise.all(
    Object.values(conn.models).map(model => model.deleteMany())
  );
}

// Handle row data
async function handleRow(row) {
  try {
    const agent = await new Agent({ agent: row['agent'] }).save();
    const user = await new User({
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
    }).save();

    const usersAccount = await new UsersAccount({
      accountName: row['account_name'],
      primary: row['primary'],
      applicantId: row['ApplicantID'],
      agencyId: row['agency_id'],
      hasActiveClientPolicy: row['hasActive ClientPolicy'],
      csr: row['csr'],
      producer: row['producer'],
      user: user._id,
    }).save();

    const policyCategory = await new PolicyCategory({
      categoryName: row['category_name'],
    }).save();

    const policyCarrier = await new PolicyCarrier({
      companyName: row['company_name'],
    }).save();

    await new PolicyInfo({
      policyNumber: row['policy_number'],
      policyStartDate: row['policy_start_date'],
      policyEndDate: row['policy_end_date'],
      policyMode: row['policy_mode'],
      premiumAmountWritten: row['premium_amount_written'],
      premiumAmount: row['premium_amount'],
      policyType: row['policy_type'],
      policyCategory: policyCategory._id,
      userId: user._id,
      companyCollectionId: policyCarrier._id,
    }).save();
  } catch (err) {
    console.error('Failed to save data:', err);
    throw err;
  }
}

// Read and process CSV file
async function readCsv(filePath) {
  await resetDatabase();
  return new Promise((resolve, reject) => {
    const tasks = [];
    csv.parseFile(filePath, { headers: true })
      .on('error', error => reject(error))
      .on('data', row => tasks.push(handleRow(row)))
      .on('end', async () => {
        try {
          await Promise.all(tasks);
          resolve({ status: 200, message: 'File uploaded successfully' });
        } catch (error) {
          reject({ status: 500, message: 'Failed during CSV processing', error });
        }
      });
  });
}

// Execute the CSV processing
readCsv(inputFilePath)
  .then(data => parentPort.postMessage(data))
  .catch(err => parentPort.postMessage(err));
