var mongoose = require("mongoose");

var policyCategorySchema = new mongoose.Schema(
  {
    categoryName: { type: String, required: true },
  },
  { collection: "policyCategory", timestamps: false }
);

const policyCategory = mongoose.model("policyCategory", policyCategorySchema);

module.exports = policyCategory;
