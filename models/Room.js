const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
  roomNumber: { type: String, required: true, unique: true },
  type: { type: String, enum: ["single", "double", "triple"], required: true },
  acType: { type: String, enum: ["ac", "non-ac"], required: true },
  capacity: { type: Number, required: true },
  occupied: { type: Number, default: 0 },
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  bills: Array,
  facilities: Array,
  rent: { type: Number, required: true },

  // ✅ Added image/photo key for storing image URL
  photo: { type: String, default: "" },

  rentDetails: [{
    amount: Number,
    dueDate: Date,
    status: { type: String },
    paidDate: Date,
  }],
  electricityBill: [{
    unit: Number,
    amount: Number,
    dueDate: Date,
    status: { type: String },
    paidDate: Date,
  }]
}, { timestamps: true });

module.exports = mongoose.model("Room", roomSchema);
