var mongoose = require("mongoose");

var policyCarrierSchema = new mongoose.Schema(
  {
    companyName: { type: String, required: true },
  },
  { collection: "policyCarrier", timestamps: false }
);

const policyCarrier = mongoose.model("policyCarrier", policyCarrierSchema);

module.exports = policyCarrier;
