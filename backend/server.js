const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./src/config/db");

const taskRoutes = require("./src/routes/tasks/taskRoutes");
const authRoutes = require("./src/routes/auth/authRoutes");
const healthRoute = require("./src/routes/health");

const app = express();

/* ---------- CORS (ALLOW ALL) ---------- */
app.use(cors());
app.use(express.json());

/* ---------- DB ---------- */
connectDB();

/* ---------- Routes ---------- */
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api", healthRoute);

/* ---------- Test ---------- */
app.get("/", (req, res) => {
  res.send("API running 🚀");
});

/* ---------- IMPORTANT ---------- */
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

