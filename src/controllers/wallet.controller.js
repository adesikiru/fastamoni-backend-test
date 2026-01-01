const Wallet = require("../models/wallet.model");

exports.getMyWallet = async (req, res) => {
  try {
    const wallet = await Wallet.findOne({ user: req.user.id });

    if (!wallet) {
      return res.status(404).json({ message: "Wallet not found" });
    }

    res.json(wallet);
  } catch {
    res.status(500).json({ message: "Failed to fetch wallet" });
  }
};
