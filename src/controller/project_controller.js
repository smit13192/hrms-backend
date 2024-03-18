const ApiError = require("../utils/error")
const ProjectModel = require("../model/project_model")
const { projectValidation } = require("../config/joi.validation");
const EmployeeModel = require("../model/employee_model");
const { EMPLOYEE_ROLE } = require("../config/string");
const { projectValidation } = require("../config/joi.validation");
const EmployeeModel = require("../model/employee_model");
const { EMPLOYEE_ROLE } = require("../config/string");

async function addProject(req, res, next) {
    try {
        req.body.companyId = req.id;
        const proValid = projectValidation.validate(req.body)
        if (proValid.error) {
            return next(new ApiError(403, proValid.error.details[0].message))
        }
        const project = new ProjectModel(req.body);
        await project.save();
        res.status(201).json({ statusCode: 201, success: true, message: "project details added successfully" });
    } catch (e) {
        next(new ApiError(400, e.message));
    }
}

async function getProject(req, res, next) {
    try {
       
        let companyId = req.id;
        if (req.role === EMPLOYEE_ROLE) {
            companyId = await EmployeeModel.getCompanyId(req.id);
        }
        const projects = await ProjectModel.find({ companyId });
        const workingProject = projects.filter((data) => data.isWorking == true)
        res.status(200).json({ statusCode: 200, success: true, data: workingProject });
    } catch (e) {
        next(new ApiError(400, e.message));
    }
}

async function getOneProject(req, res, next) {
//     try {
//         if (req.role === EMPLOYEE_ROLE) {
//             projectPipeline.unshift({
//                 $match: {
//                     employees: new Types.ObjectId(req.id),
//                     _id: new Types.ObjectId(req.params.id)
//                 }
//             });
//             const projects = await ProjectModel.aggregate(projectPipeline);
//             return res.status(200).json({ statusCode: 200, success: true, data: projects[0] });
//         }
//         projectPipeline.unshift({
//             $match: {
//                 companyId: new Types.ObjectId(req.id),
//                 _id: new Types.ObjectId(req.params.id)
//             }
//         });
//         const projects = await ProjectModel.aggregate(projectPipeline);
//         res.status(200).json({ statusCode: 200, success: true, data: projects[0] });
//     } catch (e) {
//         next(new ApiError(400, e.message));
//     }
}

async function updateProject(req, res, next) {
    try {
        await ProjectModel.findByIdAndUpdate({ _id: req.params.id }, { $set: req.body }, { new: true });
        res.status(200).json({ statusCode: 200, success: true, message: "project details update successfully" });
    } catch (e) {
        next(new ApiError(400, e.message));
    }
}

async function deleteProject(req, res, next) {
    try {
        await ProjectModel.findByIdAndUpdate({ _id: req.params.id }, { $set: { isWorking: false, status: "complete" } }, { new: true });
        res.status(200).json({ statusCode: 200, success: true, message: "project delete sucessfully" });
    } catch (error) {
        next(new ApiError(400, error.message));
    }
}

module.exports = { addProject, getProject, getOneProject, updateProject, deleteProject };