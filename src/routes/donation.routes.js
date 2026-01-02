const express = require("express");
const auth = require("../middlewares/auth.middleware");
const { createDonation } = require("../controllers/donation.controller");

const router = express.Router();

router.post("/", auth, createDonation);

module.exports = router;
