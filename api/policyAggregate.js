const User = require("../models/User");
const policyInfo = require("../models/policyInfo");

const filter = { firstName: "Lura Lucca" };

async function getdata(){
    const result = User.aggregate([{ $match: filter }]);
    for await (const doc of result) {
      console.log(doc.agent);
    }
}
getdata()

module.exports = async (req, res) => {
  try {
    await User.findOne({
      firstName: req.query.username,
    })
      .then(async (user) => {
        await policyInfo
          .findOne({ userId: user._id })
          .then((policy) => {
            res.status(200).send(policy);
          })
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));
  } catch (e) {
    res.status(502).send("Error");
  }
};
