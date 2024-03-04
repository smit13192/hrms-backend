const ApiError = require("../utils/error")
const ToggleLogModel = require("../model/toggle_log_model")
const EmployeeModel = require("../model/employee_model")
const { COMPANY_ROLE } = require("../config/string");
const ProjectModel = require("../model/project_model");

async function addToggleLog(req, res, next) {
    try {
        const { project } = req.body;
        if (!project) return next(new ApiError(400, "Project is required"));
        const employeeContainProject = await ProjectModel.findOne({ employees: req.id, _id: project });
        if (!employeeContainProject) return next(new ApiError(400, "You can not access this project log"));
        req.body.empId = req.id
        const toggle = new ToggleLogModel(req.body)
        await toggle.save()
        res.status(201).json({ statusCode: 201, success: true, data: toggle, message: "toggle log added successfully" })
    } catch (e) {
        next(new ApiError(400, e.message))
    }
}

async function getToggleLog(req, res, next) {
    try {

        const startDate = req.query.startDate ? new Date(req.query.startDate) : null;
        const endDate = req.query.endDate ? new Date(req.query.endDate) : null;

        const filter = {};
        if (startDate && endDate) {
            filter.date = {
                $gte: startDate,
                $lte: endDate,
            };
        } else if (startDate) {
            filter.date = { $gte: startDate };
        } else if (endDate) {
            filter.date = { $lte: endDate };
        }

        if (req.role === COMPANY_ROLE) {
            const populateFields = {
                path: "empId",
                populate: ["designation", "department"],
                select: {
                    email: true,
                    firstName: true,
                    middleName: true,
                    lastName: true,
                    profilePic: true,
                    mobileNo: true,
                    gender: true,
                    isWorking: true,
                    designation: true,
                    department: true,
                }
            };
            const toggle = await ToggleLogModel.find({ project: req.params.id, ...filter }).populate(populateFields);
            res.status(200).json({ statusCode: 200, success: true, data: toggle });
        }
        else {
            const toggles = await ToggleLogModel.find({ empId: req.id, ...filter })
            res.status(200).json({ statusCode: 200, success: true, data: toggles })
        }
    } catch (e) {
        next(new ApiError(400, e.message))
    }
}

async function updateToggleLog(req, res, next) {
    try {
        const toggle = await ToggleLogModel.findByIdAndUpdate({ _id: req.params.id }, { $set: req.body }, { newmm: true })
        res.status(200).json({ statusCode: 200, success: true, data: toggle, message: "toggle updated successfully" })
    } catch (e) {
        next(new ApiError(400, e.message))
    }
}

async function deleteToggleLog(req, res, next) {
    try {
        const toggle = await ToggleLogModel.findByIdAndDelete({ _id: req.params.id })
        res.status(200).json({ statusCode: 200, success: true, message: "toggle deleted successfully" })
    } catch (e) {
        next(new ApiError(400, e.message))
    }
}

module.exports = { addToggleLog, getToggleLog, updateToggleLog, deleteToggleLog }