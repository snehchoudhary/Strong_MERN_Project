const Task = require("../models/Task");
const Project = require("../models/Project");

//TASK STATUS ANALYTICS
exports.getTaskAnalytics = async (req, res) => {
    try {

        const {projectId} = req.params;

        const tasks = await Task.find({projectId});

        const totalTasks = tasks.length;

        const completed = tasks.filter(t => t.status === "completed").length;

        const pending = tasks.filter(t => t.status === "pending").length;

        const inProgress = tasks.filter(t => t.status === "in-progress").length;

        const completionRate = totalTasks === 0 ? 0 : Math.round((completed / totalTasks) * 100);

        res.json({
            totalTasks,
            completed,
            pending,
            inProgress,
            completionRate
        });
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};

//PROJECT HEALTH SCORE
exports.getProjectHealth = async (req, res) => {
    try {
        const {projectId} = req.params;

        const tasks = await Task.find({ projectId });

        if (tasks.length === 0) {
            return res.json({
                healthScore: 0
            });
        }
        const avgProgress = tasks.reduce(
            (sum, task) => sum + task.progress,
            0
        ) / tasks.length;

        let healthScore = Math.round(avgProgress);

        if (healthScore > 100) {
            healthScore = 100;
        }
        res.json ({
            healthScore
        });
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};

//ALL PROJECT ANALYSIS

exports.getAllProjectAnalytics = async (req, res) => {
    try {

        const projects = await Project.find();

        const result = [];

        for (let project of projects) {

            const tasks = await Task.find({
              projectId: project._id
            });

            const totalTasks = tasks.length;

            const completed = tasks.filter(
                t => t.status === "completed"
            ).length;

            const completionRate =
            totalTasks === 0 ? 0 : Math.round(
                (completed / totalTasks) * 100
        );

        result.push({
            projectName: project.name,
            completionRate
        });
        }
        res.json(result);
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};