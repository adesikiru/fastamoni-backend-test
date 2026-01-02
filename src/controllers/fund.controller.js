const mongoose = require("mongoose");
const Wallet = require("../models/wallet.model");
const Transaction = require("../models/transaction.model");

exports.addFunds = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { amount, idempotencyKey } = req.body;

    if (amount <= 0) {
      throw new Error("Invalid amount");
    }

    const existing = await Transaction.findOne({ idempotencyKey });
    if (existing) {
      return res.json({ message: "Duplicate funding ignored" });
    }

    const wallet = await Wallet.findOne({ user: req.user.id }).session(session);

    wallet.balance += amount;
    await wallet.save({ session });

    const transaction = await Transaction.create(
      [
        {
          user: req.user.id,
          type: "CREDIT",
          amount,
          reference: "WALLET_FUND",
          idempotencyKey,
        },
      ],
      { session }
    );

    await session.commitTransaction();

    res.json({
      message: "Wallet funded successfully",
      balance: wallet.balance,
      transaction: transaction[0],
    });
  } catch (error) {
    await session.abortTransaction();
    res.status(400).json({ message: error.message });
  } finally {
    session.endSession();
  }
};
