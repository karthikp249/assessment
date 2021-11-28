var mongoose = require('mongoose');

var usersAccountSchema = new mongoose.Schema(
  {
    accountName: { type: String, required: true },
    primary: { type: String, required: false },
    applicantId: { type: Number, required: false },
    agencyId: { type: Number, required: false },
    hasActiveClientPolicy: { type: Number, required: false },
    csr: { type: String, required: false },
    producer: { type: String, required: false },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  },
  { collection: "usersAccount", timestamps: false }
);


const usersAccount = mongoose.model('usersAccount', usersAccountSchema);

module.exports = usersAccount
