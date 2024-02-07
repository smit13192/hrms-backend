const ApiError = require("../utils/error")
const UserlogModel = require("../model/userlog_model")
const EmployeeModel = require("../model/employee_model")
const { EMPLOYEE_ROLE } = require("../config/string");

async function checkIn(req, res, next) {
    try {
        req.body.empId = req.id
        const currentDate = new Date();

        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const day = currentDate.getDate();

        const currentDateWithoutTime = new Date(year, month, day);
        req.body.date = currentDateWithoutTime;
        req.body.checkIn = currentDate;

        const findCurrentDateUserlog = await UserlogModel.findOne({ date: currentDateWithoutTime, empId: req.id });
        if (findCurrentDateUserlog) {
            return next(new ApiError(400, "You already start your timer"));
        }
        const checkIn = new UserlogModel(req.body)
        await checkIn.save()
        res.status(201).json({ success: true, message: "checkIn log added successfully" })
    } catch (e) {
        next(new ApiError(400, e.message))
    }
}

async function checkOut(req, res, next) {
    try {
        const id = req.id;
        const currentDate = new Date();

        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const day = currentDate.getDate();

        const currentDateWithoutTime = new Date(year, month, day);

        const userlog = await UserlogModel.findOne({ date: currentDateWithoutTime, empId: id });
        if (!userlog) {
            return next(new ApiError(400, "Start timer first"));
        }
        if (userlog.checkOut !== null) {
            return res.status(200).json({
                success: true,
                data: {
                    checkingTime: userlog.checkIn,
                    checkoutTime: userlog.checkOut,
                    hours: userlog.hours,
                    minutes: userlog.minutes,
                    time: Math.floor((userlog.checkOut - userlog.checkIn) / 1000),
                },
                message: "checkOut log added successfully",
            });
        }
        userlog.checkOut = currentDate;
        const durationInSeconds = Math.floor((userlog.checkOut - userlog.checkIn) / 1000);
        userlog.hours = Math.floor(durationInSeconds / (60 * 60));
        userlog.minutes = Math.floor((durationInSeconds % (60 * 60)) / (60));
        await userlog.save();

        res
            .status(200)
            .json({
                success: true,
                data: {
                    checkingTime: userlog.checkIn,
                    checkoutTime: userlog.checkOut,
                    hours: userlog.hours,
                    minutes: userlog.minutes,
                    time: durationInSeconds,
                },
                message: "checkOut log added successfully"
            });
    } catch (e) {
        next(new ApiError(400, e.message))
    }
}

async function getTime(req, res, next) {
    try {
        const id = req.id;
        let time = 0;
        const currentDate = new Date();

        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const day = currentDate.getDate();

        const currentDateWithoutTime = new Date(year, month, day);

        const findUserLog = await UserlogModel.findOne({ date: currentDateWithoutTime, empId: id });
        if (findUserLog) {
            if (findUserLog.checkOut === null) {
                time = Math.floor((currentDate - findUserLog.checkIn) / 1000)
            } else {
                return res.
                    status(200).
                    json({
                        success: true,
                        data: {
                            time: Math.floor((findUserLog.checkOut - findUserLog.checkIn) / 1000),
                            checkingTime: findUserLog.checkIn.toISOString(),
                            checkoutTime: findUserLog.checkOut.toISOString()
                        }
                    });
            }
            return res.
                status(200).
                json({
                    success: true,
                    data: {
                        time: time,
                        checkingTime: findUserLog.checkIn.toISOString(),
                        checkoutTime: findUserLog.checkOut
                    }   
                });
        } else {
            return res.
                status(200).
                json({
                    success: true,
                    data: {
                        time: time,
                        checkingTime: null,
                        checkoutTime: null
                    }
                });
        }
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

module.exports = { checkIn, checkOut, getTime, getUserlog }