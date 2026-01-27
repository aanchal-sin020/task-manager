const express = require("express");
const router = express.Router();
const Task = require("../../models/Task");
const authMiddleware = require("../../middleware/authMiddleware");

/* ================= CREATE TASK ================= */
router.post("/", authMiddleware, async (req, res) => {
  console.log("🔥 CREATE TASK HIT");
  console.log("USER:", req.user);
  console.log("BODY:", req.body);

  try {
    const { title, status = "todo", description = "" } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const task = await Task.create({
      title,
      status,                 // ✅ ALWAYS present
      description,
      user: req.user.id,
    });

    res.status(201).json({ task });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to create task",
      error: error.message,
    });
  }
});

/* ================= GET TASKS ================= */
router.get("/", authMiddleware, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id }).sort({
      createdAt: -1,
    });

    res.status(200).json({ tasks });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch tasks",
      error: error.message,
    });
  }
});

/* ================= UPDATE STATUS ================= */
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { status } = req.body;

    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { status },
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json({ task });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* ================= DELETE TASK ================= */
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json({ message: "Task deleted successfully 🗑️" });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete task",
      error: error.message,
    });
  }
});

module.exports = router;
