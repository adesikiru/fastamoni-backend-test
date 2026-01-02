const bcrypt = require("bcryptjs");
const User = require("../models/user.model");

exports.createPin = async (req, res) => {
  const { pin } = req.body;

  if (!pin || pin.length !== 4) {
    return res.status(400).json({ message: "PIN must be 4 digits" });
  }

  const hashedPin = await bcrypt.hash(pin, 12);

  await User.findByIdAndUpdate(req.user.id, {
    transactionPin: hashedPin,
  });

  res.json({ message: "Transaction PIN set successfully" });
};
