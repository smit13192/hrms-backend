const ApiError = require("../utils/error")
const ProjectModel = require("../model/project_model")

async function addProject(req, res, next) {
    try {
        req.body.companyId = req.id;
        const project = new ProjectModel(req.body);
        await project.save();
        res.status(201).json({ success: true, data: project, message: "project details added successfully" });
    } catch (e) {
        return next(new ApiError(400, e.message));
    }
}

async function getProject(req, res, next) {
    try {
        const projects = await ProjectModel.find({ companyId: req.id });
        res.status(200).json({ success: true, data: projects });
    } catch (e) {
        return next(new ApiError(400, e.message));
    }
}

async function updateProject(req, res, next) {
    try {
        const project = await ProjectModel.findByIdAndUpdate({ _id: req.params.id }, { $set: req.body }, { new: true });
        res.status(200).json({ success: true, data: project, message: "project details update successfully" });
    } catch (e) {
        return next(new ApiError(400, e.message));
    }
}

async function deleteProject(req, res, next) {
    try {
        await ProjectModel.findByIdAndDelete({ _id: req.params.id });
        res.status(200).json({ success: true, message: "project delete sucessfully" });
    } catch (error) {
        return next(new ApiError(400, e.message));
    }
}

module.exports = { addProject, getProject, updateProject, deleteProject };