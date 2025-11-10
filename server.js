const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./src/config/db");
const routes = require("./src/routes/routes");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use("/api", routes);

app.get("/health", (req, res) => res.json({ ok: true }));

(async () => {
  try {
    await connectDB(process.env.MONGO_URL);
    console.log("✅ MongoDB connected successfully");
  } catch (err) {
    console.error("❌ Failed to connect to MongoDB:", err);
  }
})();

module.exports = app;
