const Project =
  require("../models/Project");

const Task =
  require("../models/Task");

const { io } =
  require("../server");

const {
  createNotification
} =
  require("./notificationController");

// Excel library
const XLSX =
  require("xlsx");

/* ===========================
   HELPER FUNCTION
=========================== */

const sendRealtimeNotification =
  (userId, message) => {

  const socketId =
    global.onlineUsers.get(
      userId.toString()
    );

  if (socketId) {

    io.to(socketId).emit(
      "newNotification",
      { message }
    );

  }

};

/* ===========================
   UPLOAD EXCEL
=========================== */

exports.uploadExcel =
  async (req, res) => {

  try {

    const { projectId } =
      req.body;

    const workbook =
      XLSX.read(
        req.file.buffer,
        { type: "buffer" }
      );

    const sheetName =
      workbook.SheetNames[0];

    const sheetData =
      XLSX.utils.sheet_to_json(
        workbook.Sheets[sheetName]
      );

    const tasks = [];

    for (let row of sheetData) {

      const task =
        new Task({

          projectId,
          name: row.Task,
          status: row.Status,
          progress: row.Progress

        });

      await task.save();

      tasks.push(task);

    }

    // Update project progress
    await updateProjectProgress(
      projectId
    );

    const message =
      "Excel uploaded successfully";

    /* CREATE NOTIFICATION */

    await createNotification(
      req.user.id,
      message
    );

    /* REALTIME NOTIFICATION */

    sendRealtimeNotification(
      req.user.id,
      message
    );

    res.json({

      message,
      tasks

    });

  }

  catch (error) {

    res.status(500).json({
      error: error.message
    });

  }

};

/* ===========================
   CREATE TASK
=========================== */

exports.createTask =
  async (req, res) => {

  try {

    const {
      projectId,
      name
    } = req.body;

    const task =
      new Task({

        projectId,
        name

      });

    await task.save();

    const message =
      `New task "${name}" created`;

    /* CREATE NOTIFICATION */

    await createNotification(
      req.user.id,
      message
    );

    /* REALTIME NOTIFICATION */

    sendRealtimeNotification(
      req.user.id,
      message
    );

    res.status(201).json(task);

  }

  catch (error) {

    res.status(500).json({
      error: error.message
    });

  }

};

/* ===========================
   GET TASK STATS
=========================== */

exports.getTaskStats =
  async (req, res) => {

  try {

    const stats =
      await Task.aggregate([

        {
          $group: {

            _id: "$status",

            count: {
              $sum: 1
            }

          }
        }

      ]);

    let total = 0;
    let completed = 0;
    let pending = 0;
    let inProgress = 0;

    stats.forEach(item => {

      total += item.count;

      if (
        item._id === "completed"
      )
        completed = item.count;

      if (
        item._id === "pending"
      )
        pending = item.count;

      if (
        item._id === "in-progress"
      )
        inProgress = item.count;

    });

    res.json({

      total,
      completed,
      pending,
      inProgress

    });

  }

  catch (error) {

    console.error(
      "Stats error:",
      error
    );

    res.status(500).json({

      message:
        "Failed to fetch stats"

    });

  }

};

/* ===========================
   GET TASKS
=========================== */

exports.getTasks =
  async (req, res) => {

  try {

    const {
      status,
      search,
      projectId
    } = req.query;

    let filter = {};

    if (projectId)
      filter.projectId =
        projectId;

    if (status)
      filter.status =
        status;

    if (search) {

      filter.name = {

        $regex: search,
        $options: "i"

      };

    }

    const tasks =
      await Task.find(filter)
        .sort({
          createdAt: -1
        });

    res.json(tasks);

  }

  catch (error) {

    console.error(error);

    res.status(500).json({

      message:
        "Failed to fetch tasks"

    });

  }

};

/* ===========================
   UPDATE TASK
=========================== */

exports.updateTask =
  async (req, res) => {

  try {

    const task =
      await Task.findByIdAndUpdate(

        req.params.id,
        req.body,
        { new: true }

      );

    if (!task) {

      return res.status(404).json({

        message:
          "Task not found"

      });

    }

    // Update project progress
    await updateProjectProgress(
      task.projectId
    );

    const message =
      "Task updated";

    /* CREATE NOTIFICATION */

    await createNotification(
      req.user.id,
      message
    );

    /* REALTIME NOTIFICATION */

    sendRealtimeNotification(
      req.user.id,
      message
    );

    res.json(task);

  }

  catch (error) {

    console.error(error);

    res.status(500).json({

      message:
        "Task update failed"

    });

  }

};

/* ===========================
   GET RECENT TASKS
=========================== */

exports.getRecentTasks =
  async (req, res) => {

  try {

    const tasks =
      await Task.find()
        .sort({
          createdAt: -1
        })
        .limit(5);

    res.json(tasks);

  }

  catch (error) {

    res.status(500).json({

      message:
        "Failed to fetch recent tasks"

    });

  }

};

/* ===========================
   PROJECT PROGRESS
=========================== */

const updateProjectProgress =
  async (projectId) => {

  const tasks =
    await Task.find({
      projectId
    });

  if (tasks.length === 0)
    return;

  const totalProgress =
    tasks.reduce(

      (sum, task) =>
        sum + task.progress,

      0

    ) / tasks.length;

  await Project.findByIdAndUpdate(

    projectId,

    {
      progress: totalProgress
    }

  );

};