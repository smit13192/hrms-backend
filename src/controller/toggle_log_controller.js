const ApiError = require("../utils/error")
const ToggleLogModel = require("../model/toggle_log_model")
const EmployeeModel = require("../model/employee_model")
const { COMPANY_ROLE } = require("../config/string");

async function addToggleLog(req, res, next) {
    try {
        req.body.empId = req.id
        const toggle = new ToggleLogModel(req.body)
        await toggle.save()
        res.status(201).json({ success: true, data: toggle, message: "toggle log added successfully" })
    } catch (e) {
         next(new ApiError(400, e.message))
    }
}

async function getToggleLog(req, res, next) {
    try {
        if (req.role === COMPANY_ROLE) {
            const employees = await EmployeeModel.find({ company: req.id });
            const employeeId = employees.map((e) => e._id);
            const toggle = await ToggleLogModel.find({ empId: { $in: employeeId } });
            res.status(200).json({ success: true, data: toggle });
        }
        else {
            const toggles = await ToggleLogModel.find({ empId: req.id })
            res.status(200).json({ success: true, data: toggles })
        }
    } catch (e) {
         next(new ApiError(400, e.message))
    }
}

async function updateToggleLog(req, res, next) {
    try {
        const toggle = await ToggleLogModel.findByIdAndUpdate({ _id: req.params.id }, { $set: req.body }, { newmm: true })
        res.status(200).json({ success: true, data: toggle, message: "toggle updated successfully" })
    } catch (e) {
         next(new ApiError(400, e.message))
    }
}

async function deleteToggleLog(req, res, next) {
    try {
        const toggle = await ToggleLogModel.findByIdAndDelete({ _id: req.params.id })
        res.status(200).json({ success: true, message: "toggle deleted successfully" })
    } catch (e) {
         next(new ApiError(400, e.message))
    }
}

module.exports={addToggleLog,getToggleLog,updateToggleLog,deleteToggleLog}