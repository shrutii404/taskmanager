const express = require("express");
const router = express.Router();
const { getTasks, getTask, postTask, putTask, deleteTask } = require("../controllers/taskControllers");
const { verifyAccessToken } = require("../middlewares.js");

// Routes beginning with /api/tasks
router.get("/", verifyAccessToken, getTasks); // Retrieve all tasks for the authenticated user
router.get("/:taskId", verifyAccessToken, getTask); // Retrieve a specific task by ID
router.post("/", verifyAccessToken, postTask); // Create a new task
router.put("/:taskId", verifyAccessToken, putTask); // Update a task (including completed status)
router.delete("/:taskId", verifyAccessToken, deleteTask); // Delete a task by ID

module.exports = router;