var mongoose = require("mongoose");

var policyInfoSchema = new mongoose.Schema(
  {
    policyNumber: { type: String, required: true },
    policyStartDate: { type: Date, required: true },
    policyEndDate: { type: Date, required: true },
    policyCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "policyCategory",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    companyCollectionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "policycarrier",
    },
  },
  {
    collection: "policyInfo",
    timestamps: false,
  }
);

const policyInfo = mongoose.model("policyInfo", policyInfoSchema);

module.exports = policyInfo;
