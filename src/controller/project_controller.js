const ApiError = require("../utils/error")
const ProjectModel = require("../model/project_model")
const { projectValidation } = require("../config/joi.validation")

async function addProject(req, res, next) {
    try {
        req.body.companyId = req.id;

        const proValid = projectValidation.validate(req.body)
        if (proValid.error) {
            return next(new ApiError(403, proValid.error.details[0].message))
        }

        const project = new ProjectModel(req.body);
        await project.save();
        res.status(201).json({ success: true, data: project, message: "project details added successfully" });
    } catch (e) {
        next(new ApiError(400, e.message));
    }
}

async function getProject(req, res, next) {
    try {
        const projects = await ProjectModel.find({ companyId: req.id });
        const workingProject = projects.filter((data) => data.isWorking == true)
        res.status(200).json({ success: true, data: workingProject });
    } catch (e) {
        next(new ApiError(400, e.message));
    }
}

async function updateProject(req, res, next) {
    try {
        const project = await ProjectModel.findByIdAndUpdate({ _id: req.params.id }, { $set: req.body }, { new: true });
        res.status(200).json({ success: true, data: project, message: "project details update successfully" });
    } catch (e) {
        next(new ApiError(400, e.message));
    }
}

async function deleteProject(req, res, next) {
    try {
        debugger
        await ProjectModel.findByIdAndUpdate({ _id: req.params.id }, { $set: { isWorking: false } }, { new: true });
        res.status(200).json({ success: true, message: "project delete sucessfully" });
    } catch (error) {
        next(new ApiError(400, e.message));
    }
}

module.exports = { addProject, getProject, updateProject, deleteProject };