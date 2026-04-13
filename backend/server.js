const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const exerciseRoutes = require("./routes/exercise");
const dietRoutes = require("./routes/diet");
const supplementRoutes = require("./routes/supplements");
const gymPlanRoutes = require("./routes/gymPlan");
const analyticsRoutes = require("./routes/analytics");

const app = express();

// Trust Render's reverse proxy so express-rate-limit reads the real client IP
app.set("trust proxy", 1);

// Rate limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: "Too many requests from this IP, please try again after 15 minutes.",
});

// Allowed CORS origins — covers both www and non-www of the production domain
const ALLOWED_ORIGINS = [
  "https://devfit.xyz",
  "https://www.devfit.xyz",
  "http://localhost:3000",
  "http://localhost:5173",
];

// Middleware
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow server-to-server calls (no origin) and listed origins
      if (!origin || ALLOWED_ORIGINS.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS: origin ${origin} not allowed`));
      }
    },
    credentials: true,
  }),
);
app.use(express.json());
app.use("/api", limiter);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/exercise", exerciseRoutes);
app.use("/api/diet", dietRoutes);
app.use("/api/supplements", supplementRoutes);
app.use("/api/gymplan", gymPlanRoutes);
app.use("/api/analytics", analyticsRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "devFit API is running" });
});

// Global error handler — ensures CORS headers are present on every error response
app.use((err, req, res, next) => {
  const origin = req.headers.origin;
  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Credentials", "true");
  }
  console.error("Unhandled error:", err.message);
  res.status(err.status || 500).json({ message: err.message || "Internal server error" });
});

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  });
