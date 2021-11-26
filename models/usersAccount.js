var mongoose = require('mongoose');

var usersAccountSchema = new mongoose.Schema(
  {
    accountName: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  },
  { collection: "usersAcount", timestamps: false }
);


const usersAccount = mongoose.model('userAccount', usersAccountSchema);

module.exports = usersAccount
