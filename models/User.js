const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String },
  password: String,
  gender: String,
  roomAllocated: { type: mongoose.Schema.Types.ObjectId, ref: "Room", default: null },
  feeStatus: { type: String, enum: ["paid", "unpaid"], default: "unpaid" },
  phoneNumber: Number,
  detailPhotos : {
    rentAgreement : Array,
    aadharPhotos: Array,
    passportPhoto : String
  }
 
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
