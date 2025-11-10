const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./src/config/db");
const routes = require("./src/routes/routes");

dotenv.config();

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://skailama-frontend-beige.vercel.app",
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));

app.options("*", cors());

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
