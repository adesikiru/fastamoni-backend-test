/* const express = require("express");
const rateLimit = require("./middlewares/rateLimit.middleware");

const app = express();

app.use(express.json());

// Root route FIRST (no rate limit)
app.get("/", (req, res) => {
  res.json({ message: "Fastamoni API running" });
});

// Rate limit AFTER root
app.use(rateLimit);

module.exports = app;
 */


const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({ message: "Fastamoni API running" });
});

module.exports = app;
