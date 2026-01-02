const express = require("express");
const auth = require("../middlewares/auth.middleware");

const {
  getMyDonations,
  getDonationsByDate,
  getSingleDonation,
  getDonationCount,
} = require("../controllers/donation.query.controller");

const router = express.Router();

router.get("/", auth, getMyDonations);
router.get("/count", auth, getDonationCount);
router.get("/range", auth, getDonationsByDate);
router.get("/:id", auth, getSingleDonation);

module.exports = router;
