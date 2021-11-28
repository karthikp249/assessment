var mongoose = require('mongoose');

var userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    dob: { type: Date, required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    gender: { type: String, required: false },
    state: { type: String, required: true },
    zip: { type: String, required: true },
    email: { type: String, required: true },
    userType: { type: String, required: true },
    agent: { type: mongoose.Schema.Types.ObjectId, ref: "agent" },
  },
  {
    collection: "user",
    timestamps: false,
  }
);

userSchema.index({ firstName: 1 });

const User = mongoose.model('user', userSchema);

module.exports = User
