const Collection1 = require("../models/collection1");
const Collection2 = require("../models/collection2");

const moment = require("moment");
const timestampFormat = "YYYY-MM-DD HH:mm:ss";

const schedule = require("node-schedule");

module.exports = async (req, res) => {
  try {
    let timestamp = req.body.timestamp ? moment(req.body.timestamp, timestampFormat) : -1,
      message = req.body.message ? req.body.message : -1;

    if (timestamp == -1) return res.status(400).send("Please enter Timestamp");
    if (message == -1) return res.status(400).send("Please enter Message");

    const collection1 = new Collection1({
      timestamp: timestamp,
      message: message,
    });

    await collection1.save(async function (err) {
      if (err) return err;
      let date = new Date(
        timestamp.format("YYYY"),
        parseInt(timestamp.format("M")) - 1,
        timestamp.format("D"),
        timestamp.format("HH"),
        timestamp.format("mm"),
        timestamp.format("ss")
      );

      schedule.scheduleJob(date, function () {
        console.log("job created " + collection1._id);
        Collection1.findById({ _id: collection1._id }, async (err, result) => {
          const collection2 = new Collection2({
            timestamp: result.timestamp,
            message: result.message,
          });
          await collection2.save(async function (err) {
            if (err) return err;
            console.log("Job Done!");
          });
        });
      });

      res
        .status(200)
        .send(
          "job scheduled at timestamp: " +
          moment(timestamp).format(timestampFormat)
        );
    });
  } catch (e) {
    res.status(502).send("Error");
  }
};
