const Donation = require("../models/donation.model");

exports.getMyDonations = async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const donations = await Donation.find({ sender: req.user.id })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Donation.countDocuments({ sender: req.user.id });

  res.json({
    page,
    totalPages: Math.ceil(total / limit),
    total,
    donations,
  });
};

exports.getDonationsByDate = async (req, res) => {
  const { from, to } = req.query;

  const donations = await Donation.find({
    sender: req.user.id,
    createdAt: {
      $gte: new Date(from),
      $lte: new Date(to),
    },
  });

  res.json(donations);
};


exports.getSingleDonation = async (req, res) => {
  const donation = await Donation.findById(req.params.id);

  if (!donation) {
    return res.status(404).json({ message: "Donation not found" });
  }

  res.json(donation);
};


exports.getDonationCount = async (req, res) => {
  const count = await Donation.countDocuments({ sender: req.user.id });
  res.json({ count });
};
