require("dotenv").config();
const express = require("express");
const cors = require("cors");

const db = require("./config/db"); 
const authRoutes = require("./routes/auth");
const preferencesRoutes = require('./routes/preferences');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Root check
app.get("/", (req, res) => {
  res.json({ status: "Backend is running 🚀" });
});

// DB check route
app.get("/db-check", async (req, res) => {
  try {
    const result = await db.query("SELECT NOW()");
    res.json({
      status: "✅ Connected to Supabase Postgres!",
      time: result.rows[0].now,
    });
  } catch (err) {
    res.status(500).json({ status: "❌ DB connection failed", error: err.message });
  }
});

// Auth routes
app.use("/api/auth", authRoutes);
// Preferences routes
app.use('/api/preferences', preferencesRoutes);

app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
