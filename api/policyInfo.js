const User = require("../models/User");
const policyInfo = require("../models/policyInfo");

module.exports = async (req, res) => {
  try {
    await User.findOne({
      firstName: req.query.username,
    })
      .then(async (user) => {
        if (user) {
          await policyInfo
            .findOne({ userId: user._id })
            .then((policy) => {
              res.status(200).send(policy);
            })
            .catch((err) => console.log(err));
        } else {
          res.status(400).send("Invalid username");
        }
      })
      .catch((err) => console.log(err));
  } catch (e) {
    res.status(502).send("Error");
  }
};
