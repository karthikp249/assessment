const User = require("../models/User");
const policyInfo = require("../models/policyInfo");

async function getdata() {

  const result = User.aggregate([{ $match: { firstName: "Lura Lucca" } }, {
    $lookup: {
      from: "policyInfo",
      localField: "_id",
      foreignField: "userId",
      as: "policy"
    }
  }]);

  for await (const doc of result) {
    console.log(doc);
  }
}
/* getdata() */

exports.getDataByUsername = async (req, res) => {
  try {
    let userName = (req.query.userName) ? req.query.userName : -1;

    if (userName == -1) return res.status(400).send("Please enter Username");

    await User.aggregate([{ $match: { firstName: userName } }, {
      $lookup: {
        from: "policyInfo",
        localField: "_id",
        foreignField: "userId",
        as: "policy"
      }
    }]).then(async (result) => {
      if (result.length > 0) {
        res.status(200).json(result);
      } else {
        res.status(404).send("User not found!");
      }
    }).catch((err) => { res.status(502).send("Error"); });


  } catch (e) {
    res.status(502).send("Error");
  }
};

exports.getEachUserData = async (req, res) => {
  try {
    await User.aggregate([{
      $lookup: {
        from: "policyInfo",
        localField: "_id",
        foreignField: "userId",
        as: "policy"
      }
    }]).then(async (result) => {
      if (result.length > 0) {
        res.status(200).json(result);
      } else {
        res.status(404).send("No user Data!");
      }
    }).catch((err) => { res.status(502).send("Error"); });
  } catch (e) {
    res.status(502).send("Error");
  }
};
