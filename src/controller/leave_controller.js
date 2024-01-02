const ApiError = require("../utils/error");
const LeaveModel = require("../model/leave_model");
const { COMPANY_ROLE } = require("../config/string");
const EmployeeModel = require("../model/employee_model");

async function addLeave(req, res, next) {
    try {
        req.body.empId = req.id;
        const leave = new LeaveModel(req.body);
        await leave.save();
        res.status(201).json({ success: true, data: leave, message: "leave added successfully" });
    } catch (e) {
        return next(new ApiError(400, e.message));
    }
}

async function getLeave(req, res, next) {
    try {
        if (req.role === COMPANY_ROLE) {
            const employees = await EmployeeModel.find({ company: req.id })
            const employeeId = employees.map((e) => e._id);
            const leaves = await LeaveModel.find({ empId: { $in: employeeId } }).populate("empId")
            res.status(200).json({ success: true, data: leaves });
        }
        else {
            const leaves = await LeaveModel.find({ empId: req.id });
            res.status(200).json({ success: true, data: leaves });
        }
    } catch (e) {
        return next(new ApiError(400, e.message));
    }
}

async function updateLeave(req, res, next) {
    try {
        const leave = await LeaveModel.findByIdAndUpdate({ _id: req.params.id }, { $set: req.body }, { new: true });
        res.status(200).json({ success: true, data: leave, message: "leave updated successfully" });
    } catch (e) {
        return next(new ApiError(400, e.message));
    }
}

async function deleteLeave(req, res, next) {
    try {
        const leaveId = req.params.id;
        const checkStatus = await LeaveModel.findById({ _id: leaveId });
        if (checkStatus.status === "pending") {
            await LeaveModel.findByIdAndDelete({ _id: leaveId });
            res.status(200).json({ success: true, message: "leave delete successfully" });
        }
        else {
            return next(new ApiError(403, "you are not able to delete leaves"));
        }
    } catch (e) {
        return next(new ApiError(400, e.message));
    }
}

module.exports = { addLeave, getLeave, updateLeave, deleteLeave };