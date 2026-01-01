const express = require("express");
const auth = require("../middlewares/auth.middleware");
const { getMyWallet } = require("../controllers/wallet.controller");

const router = express.Router();

router.get("/me", auth, getMyWallet);

module.exports = router;