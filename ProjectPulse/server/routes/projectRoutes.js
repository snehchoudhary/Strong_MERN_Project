 const express = require("express");
 const upload =
require("../middleware/uploadMiddleware");
const {
  downloadSheet
} = require(
  "../controllers/projectController"
);
const {
  parseExcelToTasks
} = require("../controllers/projectController");

const {
    createProject,
    getProjects,
    updateProject,
    deleteProject,
    uploadSheet
} = require("../controllers/projectController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

//create project
router.post("/", authMiddleware, createProject);

//get projects
router.get("/", authMiddleware, getProjects);

//update project
router.put("/:id", authMiddleware, updateProject);

// DELETE PROJECT

router.delete(
  "/:id",
  authMiddleware,
  deleteProject
);

router.post(
  "/:id/upload",
  authMiddleware,
  upload.single("file"),
  uploadSheet
);

//download files from gridfs
router.get(
  "/:id/download",
  authMiddleware,
  downloadSheet
);

//excel data parsing into tasks
router.post(
  "/:id/parse",
  authMiddleware,
  parseExcelToTasks
);

module.exports = router;