const mongoose = require("mongoose");

const donationSchema = new mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    beneficiary: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    amount: { type: Number, required: true },
    idempotencyKey: { type: String, unique: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Donation", donationSchema);
