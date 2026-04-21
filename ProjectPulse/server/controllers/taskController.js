const Task = require("../models/Task");
const Project = require("../models/Project");

//new update for excel upload logic
const XLSX = require("xlsx");

// UPLOAD EXCEL
exports.uploadExcel = async (req, res) => {
    try {
        const { projectId } = req.body;

        const workbook = XLSX.read(req.file.buffer, {
            type: "buffer"
        });

        const sheetName = workbook.SheetNames[0];

        const sheetData = XLSX.utils.sheet_to_json(
            workbook.Sheets[sheetName]
        );

        const tasks = [];

        for (let row of sheetData) {
            const task = new Task({
                projectId,
                name: row.Task,
                status: row.Status,
                progress: row.Progress
            });

            await task.save();

            tasks.push(task);
        }

        await updateProjectProgress(projectId);

        res.json({
            message: "Excel uploaded successfully", 
            tasks
        });
    }  catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};

// CREATE TASKS FOR A PROJECT
exports.createTask = async (req, res) => {
    try {

        const {projectId, name} = req.body;

        const task = new Task ({
            projectId,
            name
        });

        await task.save();

        res.status (201).json(task);
    } catch (error) {
        res.status(500).json({ error: error.message});
    }
};

//GET TASK STATS (Analytics Dashboard)
exports.getTaskStats = async (req, res) => {
    try {

        const total = await Task.countDocuments();

        const completed = await Task.countDocuments({
            status: "completed"
        });

        const pending = await Task.countDocuments({
            status: "pending"
        });

        const inProgress = await Task.countDocuments({
            status: "in-progress"
        });

        res.json({
            total, completed, pending, inProgress
        });
    } catch (error) {
        res.status(500).json ({
            message: error.message
        });
    }
}

// GET TASKS FOR A PROJECT
exports.getTasks = async (req, res) => {
    try {

        const tasks = await Task.find({
            projectId: req.params.projectId
        });

        res.json(tasks);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

//UPDATE TASK API
exports.updateTask = async(req, res) => {
    try {

        const task = await Task.findByIdAndUpdate(
            req.params.id,
            req.body,
            {new: true}
        );

        //update project progress
        await updateProjectProgress(task.projectId);

        res.json(task);

    } 
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};

//AUTO UPDATE PROJECT PROGRESS

const updateProjectProgress = async (projectId) => {
    const tasks = await Task.find({ projectId });

    if (tasks.length === 0) return;

    const totalProgress = tasks.reduce((sum, task) => sum + task.progress, 0) / tasks.length;
    
    await Project.findByIdAndUpdate(projectId, {
        progress: totalProgress
    });
};



