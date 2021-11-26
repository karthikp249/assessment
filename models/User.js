var mongoose = require('mongoose');

var userSchema = new mongoose.Schema(
    {
        fisrtname: { type: String, required: true },
        dob: { type: Date, required: true },
        address: { type: String, required: true },
        phone: { type: String, required: true },
        state: { type: String, required: true },
        zip: { type: String, required: true },
        email: { type: String, required: true },
        userType: { type: String, required: true },
        agent: { type: mongoose.Schema.Types.ObjectId, ref: 'agent' }
    },
    {
        collection: 'user',
        timestamps: false
    },
);

/* userSchema.index({ agent: 1 }); */

const User = mongoose.model('user', userSchema);

module.exports = User
