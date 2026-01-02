const express = require("express");
const auth = require("../middlewares/auth.middleware");
const { createPin } = require("../controllers/pin.controller");

const router = express.Router();

router.post("/set", auth, createPin);

module.exports = router;
