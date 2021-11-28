var mongoose = require("mongoose");

var collection2Schema = new mongoose.Schema(
  {
    timestamp: { type: Date, required: true },
    message: { type: String, required: true },
  },
  {
    collection: "collection2",
    timestamps: false,
  }
);

const Collection2 = mongoose.model("collection2", collection2Schema);

module.exports = Collection2;
