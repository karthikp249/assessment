const Collection1 = require("../models/collection1");
const Collection2 = require("../models/collection2");

const moment = require("moment");

const schedule = require("node-schedule");

var date = new Date(2021, 10, 28, 16, 37, 0);

schedule.scheduleJob(date, function () {
  console.log("The world is going to end today. 1");
});

module.exports = async (req, res) => {
  try {
    const collection1 = new Collection1({
      timestamp: req.body.timestamp,
      message: req.body.message,
    });

    await collection1.save(async function (err) {
      if (err) return err;
      res.send("job created");
    });
  } catch (e) {
    res.status(502).send("Error");
  }
};
