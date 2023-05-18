const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const contactSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  fullName: {
    type: String,
    required: true,
  },
  mobileNumber: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  importFlag: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("Contacts", contactSchema);
