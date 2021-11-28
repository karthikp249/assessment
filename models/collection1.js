var mongoose = require("mongoose");

var collection1Schema = new mongoose.Schema(
  {
    timestamp: { type: Date, required: true },
    message: { type: String, required: true },
  },
  {
    collection: "collection1",
    timestamps: false,
  }
);

const Collection1 = mongoose.model("collection1", collection1Schema);

module.exports = Collection1;
