const express = require("express");
const cors = require("cors");
const connectDB = require("./src/config/db");

const taskRoutes = require("./src/routes/tasks/taskRoutes");
const authRoutes = require("./src/routes/auth/authRoutes");
const healthRoute = require("./src/routes/health");

const app = express();

/* ---------- Middleware ---------- */
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());
app.options("*", cors());

/* ---------- DB ---------- */
connectDB();

/* ---------- Routes ---------- */
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api", healthRoute);

app.get("/", (req, res) => {
  res.status(200).send("API running 🚀");
});

/* ---------- PORT (CRITICAL) ---------- */
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});


