const express = require("express");
const {
    createProject,
    getProjects,
    updateProject
} = require("../controllers/projectController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, createProject);

router.get("/", authMiddleware, getProjects);

router.patch("/:id", authMiddleware, updateProject);

module.exports = router;