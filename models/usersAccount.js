var mongoose = require('mongoose');

var usersAccountSchema = new mongoose.Schema(
    {
        accountName: { type: String, required: true },
    },
    {   collection : 'usersAcount',
        timestamps: false },
);


const usersAccount = mongoose.model('userAccounts', usersAccountSchema);

module.exports = usersAccount
