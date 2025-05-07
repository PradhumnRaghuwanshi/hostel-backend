  const mongoose = require("mongoose");

  const rentSchema = new mongoose.Schema({
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: true,
      unique: true // one record per room
    },
    rentPayments: [
      {
        amountPaid: Number,
        amountDue: Number,
        datePaid: Date,
        status: { type: String, enum: ["paid", "unpaid"], default: "unpaid" }
      }
    ],
    totalRentDue: Number,           // Total expected rent
    totalRentPaid: Number,          // Cumulative paid amount
    rentStatus: {                   // Overall status
      type: String,
      enum: ["paid", "unpaid", "partial"],
      default: "unpaid"
    },

    electricity: {
      unitsConsumed: Number,
      electricityAmountDue: Number,
      electricityStatus: {
        type: String,
        enum: ["paid", "unpaid", "partial"],
        default: "unpaid"
      }
    }
  }, { timestamps: true });

  module.exports = mongoose.model("Rent", rentSchema);
