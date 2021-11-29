const User = require("../models/User");
const policyInfo = require("../models/policyInfo");

module.exports = async (req, res) => {
  try {

    let userName = (req.query.userName) ? req.query.userName : -1;
    if (userName == -1) return res.status(400).send("Please enter Username");

    await User.findOne({
      firstName: userName,
    })
      .then(async (user) => {
        if (user) {
          await policyInfo
            .findOne({ userId: user._id })
            .then((policy) => {
              res.status(200).json(policy);
            })
            .catch((err) => console.log(err));
        } else {
          res.status(404).send("User not found!");
        }
      })
      .catch((err) => console.log(err));
  } catch (e) {
    res.status(502).send("Error");
  }
};
