const ApiError = require("../utils/error")
const UserlogModel = require("../model/userlog_model")
const EmployeeModel = require("../model/employee_model")
const { EMPLOYEE_ROLE } = require("../config/string");

async function checkIn(req, res, next) {
    try {
        req.body.empId = req.id
        const checkIn = new UserlogModel(req.body)
        await checkIn.save()
        res.status(201).json({ success: true, message: "checkIn log added suggesfully" })
    } catch (e) {
         next(new ApiError(400, e.message))
    }
}

async function checkOut(req, res, next) {
    try {
        const id = req.params.id
        await UserlogModel.findByIdAndUpdate({ _id: id }, { $set: req.body }, { new: true })

        const userlog = await UserlogModel.findById({ _id: id });
        const checkInTime = userlog.checkIn
        const checkOutTime = userlog.checkOut
        const durationInMillis = checkOutTime - checkInTime;
        const hours = Math.floor(durationInMillis / (1000 * 60 * 60));
        const minutes = Math.floor((durationInMillis % (1000 * 60 * 60)) / (1000 * 60));

        req.body.hours=hours
        req.body.minutes=minutes
        await UserlogModel.findByIdAndUpdate({ _id: id }, { $set: req.body }, { new: true })

        res.status(201).json({ success: true, message: "checkOut log added suggesfully" })
    } catch (e) {
         next(new ApiError(400, e.message))
    }
}

async function getUserlog(req, res, next) {
    try {
        if (req.role === EMPLOYEE_ROLE) {
            const userlog = await UserlogModel.find({ empId: req.id })
            res.status(200).json({ success: true, data: userlog })
        }
        else {
            const employees = await EmployeeModel.find({ company: req.id });
            const employeeId = employees.map((e) => e._id);
            const userlog = await UserlogModel.find({ empId: { $in: employeeId } });
            res.status(200).json({ success: true, data: userlog })
        }

    } catch (e) {
         next(new ApiError(400, e.message))
    }
}

module.exports = { checkIn, checkOut, getUserlog }