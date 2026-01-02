const express = require("express");
const auth = require("../middlewares/auth.middleware");
const { createDonation, getDonations, getDonationsByRange, getDonationsCount } = require("../controllers/donation.controller");

const router = express.Router();

router.post("/", auth, createDonation);
router.get("/", auth, getDonations);
router.get("/range", auth, getDonationsByRange);
router.get("/count", auth, getDonationsCount);

module.exports = router;
