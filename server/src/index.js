const express = require("express");
const cors = require("cors");
require("dotenv").config();

const pool = require("./config/db");
const vehicleRoutes = require("./routes/vehicleRoutes");
const authRoutes = require("./routes/authRoutes");
const imageRoutes = require("./routes/imageRoutes");

const app = express();

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. curl, Postman)
      if (!origin) return callback(null, true);
      // Allow any localhost port in development
      if (/^http:\/\/localhost:\d+$/.test(origin)) return callback(null, true);
      // Allow the configured CLIENT_URL in production
      if (origin === process.env.CLIENT_URL) return callback(null, true);
      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.use(express.json());

// Routes
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/images", imageRoutes);

// Home route
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to Sheger Motors API 🚗",
  });
});

// Database health check
app.get("/api/health", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");

    res.status(200).json({
      status: "OK",
      database: "Connected",
      time: result.rows[0].now,
    });
  } catch (error) {
    console.error("Database health check failed:", error);

    res.status(500).json({
      status: "ERROR",
      database: "Disconnected",
    });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Sheger Motors server running on port ${PORT}`);
});