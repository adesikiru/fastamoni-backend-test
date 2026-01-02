const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    type: { type: String, enum: ["DEBIT", "CREDIT"] },
    amount: Number,
    reference: String,
    idempotencyKey: {
      type: String,
      unique: true,
      sparse: true,
    },

  },
  { timestamps: true }
);

module.exports = mongoose.model("Transaction", transactionSchema);
