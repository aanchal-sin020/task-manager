const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const taskRoutes = require("./routes/tasks/taskRoutes");
const authRoutes = require("./routes/auth/authRoutes");
const healthRoute = require("./routes/health");

const app = express();

/* Middleware */
app.use(cors());
app.use(express.json());

/* DB */
connectDB();

/* Routes */
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api", healthRoute);

app.get("/", (req, res) => {
  res.send("API running 🚀");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Server running on port " + PORT));


