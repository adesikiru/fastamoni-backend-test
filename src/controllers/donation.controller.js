const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const User = require("../models/user.model");
const Wallet = require("../models/wallet.model");
const Donation = require("../models/donation.model");
const Transaction = require("../models/transaction.model");
const { sendThankYou } = require("../services/email.service");

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
            { session, ordered: true }
        );

        await session.commitTransaction();

        // Check if user has made 2+ donations and send thank you email
        const donationCount = await Donation.countDocuments({ sender: req.user.id });
        if (donationCount >= 2) {
            await sendThankYou(user.email);
        }

        res.status(201).json({ donation: donation[0] });
    } catch (error) {
        await session.abortTransaction();
        res.status(400).json({ message: error.message });
    } finally {
        session.endSession();
    }
};

exports.getDonations = async (req, res) => {
try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const donations = await Donation.find({ $or: [{ sender: req.user.id }, { beneficiary: req.user.id }] })
        .populate("sender", "fullName email")
        .populate("beneficiary", "fullName email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    const total = await Donation.countDocuments({ $or: [{ sender: req.user.id }, { beneficiary: req.user.id }] });

    res.json({
        donations,
        pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit),
        },
    });
} catch (error) {
    res.status(500).json({ message: error.message });
}
};

exports.getDonationsByRange = async (req, res) => {
    try {
        const { from, to } = req.query;
        const fromDate = new Date(from);
        const toDate = new Date(to);

        const donations = await Donation.find({
            $or: [{ sender: req.user.id }, { beneficiary: req.user.id }],
            createdAt: { $gte: fromDate, $lte: toDate },
        })
            .populate("sender", "fullName email")
            .populate("beneficiary", "fullName email")
            .sort({ createdAt: -1 });

        res.json({ donations });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getDonationsCount = async (req, res) => {
    try {
        const count = await Donation.countDocuments({ $or: [{ sender: req.user.id }, { beneficiary: req.user.id }] });
        res.json({ count });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
