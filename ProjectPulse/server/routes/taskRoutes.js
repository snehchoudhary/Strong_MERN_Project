const express = require("express");

const upload =
  require("../middleware/uploadMiddleware");

const {
  createTask,
  getTasks,
  getTaskStats,
  updateTask,
  uploadExcel,
  getRecentTasks
} = require("../controllers/taskController");

const authMiddleware =
  require("../middleware/authMiddleware");

const router = express.Router();

/* ===========================
   CREATE TASK
=========================== */

router.post(
  "/",
  authMiddleware,
  createTask
);

/* ===========================
   TASK STATS
=========================== */

router.get(
  "/stats/summary",
  authMiddleware,
  getTaskStats
);

/* ===========================
   GET TASKS (WITH FILTERS)
=========================== */

router.get(
  "/",
  authMiddleware,
  getTasks
);

/* ===========================
   UPDATE TASK
=========================== */

router.put(
  "/:id",
  authMiddleware,
  updateTask
);

/* ===========================
   UPLOAD EXCEL
=========================== */

router.post(
  "/upload",
  authMiddleware,
  upload.single("file"),
  uploadExcel
);

// Get Recent tasks
router.get(
  "/recent",
  authMiddleware,
  getRecentTasks
);

module.exports = router;