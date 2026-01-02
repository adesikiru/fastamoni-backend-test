const express = require("express");
const auth = require("../middlewares/auth.middleware");
const { addFunds } = require("../controllers/fund.controller");

const router = express.Router();

router.post("/add", auth, addFunds);

module.exports = router;
