const express = require("express");

const {
    getTaskAnalytics,
    getProjectHealth,
    getAllProjectAnalytics
} = require("../controllers/analyticsController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get (
    "/tasks/:projectId",
    authMiddleware,
    getTaskAnalytics
);

router.get(
    "/health/:projectId",
    authMiddleware,
    getProjectHealth
);

router.get(
    "/projects",
    authMiddleware,
    getAllProjectAnalytics
);

module.exports = router;