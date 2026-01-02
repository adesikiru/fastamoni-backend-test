const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const User = require("../models/user.model");
const Wallet = require("../models/wallet.model");
const Donation = require("../models/donation.model");
const Transaction = require("../models/transaction.model");
const { sendThankYou } = require("../services/email.service");

const donationCount = await Donation.countDocuments({ sender: req.user.id });

if (donationCount >= 2) {
  const user = await User.findById(req.user.id);
  await sendThankYou(user.email);
}

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
