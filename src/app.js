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


/* const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({ message: "Fastamoni API running" });
});

module.exports = app; */


const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth.routes");
const walletRoutes = require("./routes/wallet.routes");
const pinRoutes = require("./routes/pin.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/wallet", walletRoutes);
app.use("/api/pin", pinRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Fastamoni API running" });
});

app.use("/api/auth", authRoutes);

module.exports = app;

