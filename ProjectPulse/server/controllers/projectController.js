const Project = require("../models/Project");
const mongoose = require("mongoose");
const { GridFSBucket } = require("mongodb");
const XLSX = require("xlsx");
const Task = require("../models/Task");


/* ===========================
   CREATE PROJECT
=========================== */

// Create Project

exports.createProject =
  async (req, res) => {

    try {

      const {
        name,
        description,
        deadline,
        assignedTo
      } = req.body;

      // Validate assigned user

      if (!assignedTo) {

        return res.status(400).json({
          message:
            "Please select a lead"
        });

      }

      const project =
        new Project({

          name,
          description,
          deadline,

          // Lead selected
          assignedTo,

          // Logged-in manager
          managerId:
            req.user.id

        });

      await project.save();

      res.status(201).json({
        message:
          "Project created successfully",
        project
      });

    }

    catch (error) {

      console.error(
        "Create Project Error:",
        error
      );

      res.status(500).json({
        message:
          "Failed to create project"
      });

    }

};


/* ===========================
   GET PROJECTS
=========================== */

exports.getProjects = async (req, res) => {

  try {

    let projects;

    // LEAD sees ALL projects

    if (req.user.role === "lead") {

      projects =
        await Project.find()
        .populate("ownerId",
          "name email");

    }

    // PM sees ONLY OWN projects

    else {

      projects =
        await Project.find({

          ownerId: req.user.id

        });

    }

    res.json(projects);

  } catch (error) {

    res.status(500).json({

      message: "Failed to fetch projects"

    });

  }

};



/* ===========================
   UPDATE PROJECT
=========================== */

exports.updateProject = async (req, res) => {

  try {

    const project =
      await Project.findById(
        req.params.id
      );

    if (!project) {

      return res.status(404).json({

        message: "Project not found"

      });

    }

    // Authorization Check

    if (

      req.user.role !== "lead" &&

      project.ownerId.toString() !==
      req.user.id

    ) {

      return res.status(403).json({

        message: "Not authorized"

      });

    }

    // Update fields

    project.name =
      req.body.name ||
      project.name;

    project.description =
      req.body.description ||
      project.description;

    project.status =
      req.body.status ||
      project.status;

    await project.save();

    res.json({

      message:
        "Project updated successfully",

      project

    });

  }

  catch (error) {

    res.status(500).json({

      message:
        "Project update failed"

    });

  }

};


/* ===========================
   UPLOAD SHEET
=========================== */

exports.uploadSheet = async (req, res) => {

  try {

    const projectId =
      req.params.id;

    if (!req.file) {

      return res.status(400).json({
        message: "No file uploaded"
      });

    }

    const bucket =
      new GridFSBucket(
        mongoose.connection.db,
        {
          bucketName: "uploads"
        }
      );

    // Create upload stream

    const uploadStream =
      bucket.openUploadStream(
        req.file.originalname
      );

    uploadStream.end(
      req.file.buffer
    );

    uploadStream.on(
      "finish",
      async () => {

        const fileId =
          uploadStream.id;

        // Save file reference in project

        await Project.findByIdAndUpdate(

          projectId,

          {
            fileId: fileId
          }

        );

        res.json({

          message:
            "File stored in GridFS",

          fileId

        });

      }

    );

  }

  catch (error) {

    console.error(error);

    res.status(500).json({

      message:
        "File upload failed"

    });

  }

};


/* ===========================
   DOWNLOAD FILE FROM GRIDFS
=========================== */

exports.downloadSheet = async (req, res) => {

  try {

    const projectId =
      req.params.id;

    const project =
      await Project.findById(
        projectId
      );

    if (
      !project ||
      !project.fileId
    ) {

      return res.status(404).json({

        message:
          "No file found for this project"

      });

    }

    const bucket =
      new mongoose.mongo.GridFSBucket(

        mongoose.connection.db,

        {
          bucketName:
            "uploads"
        }

      );

    // Open download stream

    const downloadStream =
      bucket.openDownloadStream(
        project.fileId
      );

    res.set(
      "Content-Type",
      "application/octet-stream"
    );

    res.set(
      "Content-Disposition",
      "attachment"
    );

    downloadStream.pipe(res);

  }

  catch (error) {

    console.error(error);

    res.status(500).json({

      message:
        "Download failed"

    });

  }

};


/* ===========================
   PARSE EXCEL → CREATE TASKS
=========================== */

exports.parseExcelToTasks = async (req, res) => {

  try {

    const projectId =
      req.params.id;

    const project =
      await Project.findById(
        projectId
      );

    if (!project || !project.fileId) {

      return res.status(404).json({
        message: "No Excel file found"
      });

    }

    const bucket =
      new mongoose.mongo.GridFSBucket(
        mongoose.connection.db,
        {
          bucketName: "uploads"
        }
      );

    const downloadStream =
      bucket.openDownloadStream(
        project.fileId
      );

    let fileData = [];

    downloadStream.on(
      "data",
      chunk => {

        fileData.push(chunk);

      }
    );

    downloadStream.on(
      "end",
      async () => {

        const buffer =
          Buffer.concat(fileData);

        /* Read Excel */

        const workbook =
          XLSX.read(buffer, {
            type: "buffer"
          });

        const sheetName =
          workbook.SheetNames[0];

        const worksheet =
          workbook.Sheets[sheetName];

        const rows =
          XLSX.utils.sheet_to_json(
            worksheet
          );

        /* Create Tasks */

        let createdTasks = [];

        for (let row of rows) {

          const task =
            new Task({

              title:
                row.Title ||
                row.title,

              description:
                row.Description ||
                "",

              status:
                row.Status ||
                "pending",

              projectId

            });

          await task.save();

          createdTasks.push(task);

        }

        res.json({

          message:
            "Tasks created from Excel",

          count:
            createdTasks.length

        });

      }

    );

  }

  catch (error) {

    console.error(error);

    res.status(500).json({
      message:
        "Excel parsing failed"
    });

  }

};

// 
/* ===========================
   DELETE PROJECT
=========================== */

exports.deleteProject = async (req, res) => {

  try {

    const project =
      await Project.findById(
        req.params.id
      );

    if (!project) {

      return res.status(404).json({

        message: "Project not found"

      });

    }

    // Authorization Check

    if (

      req.user.role !== "lead" &&

      project.ownerId.toString() !==
      req.user.id

    ) {

      return res.status(403).json({

        message: "Not authorized"

      });

    }

    await project.deleteOne();

    res.json({

      message:
        "Project deleted successfully"

    });

  }

  catch (error) {

    res.status(500).json({

      message:
        "Project deletion failed"

    });

  }

};