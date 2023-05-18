const { Binary } = require("bson");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  fullName: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  mobileNumber: String,
  address: String,
  importFlag: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("User", userSchema);
