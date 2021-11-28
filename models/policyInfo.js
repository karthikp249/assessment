var mongoose = require("mongoose");

var policyInfoSchema = new mongoose.Schema(
  {
    policyNumber: { type: String, required: true },
    policyStartDate: { type: Date, required: true },
    policyEndDate: { type: Date, required: true },
    policyMode: { type: Number, required: true },
    premiumAmountWritten: { type: Number, required: false },
    premiumAmount: { type: Number, required: true },
    policyType: { type: String, required: true },
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
