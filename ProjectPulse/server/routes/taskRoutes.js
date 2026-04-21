const express = require("express");

const upload = require("../middleware/uploadMiddleware");


const {
    createTask,
    getTasks,
    getTaskStats,
    updateTask,
    uploadExcel
} = require("../controllers/taskController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, createTask);

//stats route
router.get("/stats/summary",authMiddleware,  getTaskStats);

router.get("/:projectId", authMiddleware, getTasks);


router.patch("/:id", authMiddleware, updateTask);

router.post(
    "/upload",
    authMiddleware,
    upload.single("file"),
    uploadExcel
);

module.exports = router;