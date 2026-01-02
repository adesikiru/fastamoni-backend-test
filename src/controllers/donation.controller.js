const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const User = require("../models/user.model");
const Wallet = require("../models/wallet.model");
const Donation = require("../models/donation.model");
const Transaction = require("../models/transaction.model");

exports.createDonation = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { beneficiaryId, amount, pin, idempotencyKey } = req.body;

    const user = await User.findById(req.user.id).select("+transactionPin");
    const isPinValid = await bcrypt.compare(pin, user.transactionPin);
    if (!isPinValid) throw new Error("Invalid PIN");

    if (await Donation.findOne({ idempotencyKey })) {
      return res.json({ message: "Duplicate request ignored" });
    }

    const senderWallet = await Wallet.findOne({ user: req.user.id }).session(session);
    const receiverWallet = await Wallet.findOne({ user: beneficiaryId }).session(session);

    if (senderWallet.balance < amount) throw new Error("Insufficient balance");

    senderWallet.balance -= amount;
    receiverWallet.balance += amount;

    await senderWallet.save({ session });
    await receiverWallet.save({ session });

    const donation = await Donation.create(
      [
        { sender: req.user.id, beneficiary: beneficiaryId, amount, idempotencyKey },
      ],
      { session }
    );

    await Transaction.create(
      [
        { user: req.user.id, type: "DEBIT", amount, reference: donation[0]._id },
        { user: beneficiaryId, type: "CREDIT", amount, reference: donation[0]._id },
      ],
      { session }
    );

    await session.commitTransaction();
    res.status(201).json({ donation: donation[0] });
  } catch (error) {
    await session.abortTransaction();
    res.status(400).json({ message: error.message });
  } finally {
    session.endSession();
  }
};
