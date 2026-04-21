const Project = require("../models/Project");

exports.createProject = async (req, res) => {
    try {
        const { name, description, deadline } = req.body;

        const project = new Project({
            name,
            description,
            deadline,
            managerId: req.user.id
        });

        await project.save();

        res.status(201).json({
            message: "Project created",
            project
        });
    }
     catch (error) {
        res.status(500).json({error: error.message});
     }
};

//GET PROJECTS API

exports.getProjects = async (req, res) => {
    try {
        let projects;

        if (req.user.role === "lead") {
            projects = await Project.find().populate("managerId", "name email");
        }
        else {
            projects = await Project.find({ managerId: req.user.id});
        }
        res.json(projects);
    } catch (error) {
        res.status (500).json({ error: error.message })
    }
};

//UPDATE PROJECT API

exports.updateProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        if (
            req.user.role !== "lead" &&
            project.managerId.toString() != req.user.id 
        )
 {
    return res.status(403).json({message: "Not authorized"});
 }  
 
 Object.assign(project, req.body);

 await project.save();

 res.json(project);
    }
    catch (error) {
        res.status(500).json({ error: error.message});
    }
}