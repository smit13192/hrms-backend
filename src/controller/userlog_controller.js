const ApiError = require("../utils/error")
const UserlogModel = require("../model/userlog_model")
const LeaveModel = require("../model/leave_model")
const mongoose = require("mongoose")

async function startTime(req, res, next) {
    try {
        const currentDate = new Date();

        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const day = currentDate.getDate();

        const currentDateWithoutTime = new Date(year, month, day);

        const findLeave = await LeaveModel.findOne({ empId: req.id, startDate: { $lte: currentDate }, endDate: { $gte: currentDate } });

        if(findLeave) {
            return next(new ApiError(400, "Your leave day you cannot start timer"));
        }
        const findCurrentDateUserlog = await UserlogModel.findOne({ date: currentDateWithoutTime, empId: req.id });

        if (findCurrentDateUserlog) {
            if(findCurrentDateUserlog.isLogout) {
                return next(new ApiError(400, "After logout you can not start timer"));
            }
            if (findCurrentDateUserlog.timeBlock[findCurrentDateUserlog.timeBlock.length - 1].endTime !== null) {
                findCurrentDateUserlog.timeBlock.push({ startTime: currentDate, endTime: null });
                await findCurrentDateUserlog.save();
                return res.status(201).json({ statusCode: 201, success: true, message: "Time start" })
            }
            return next(new ApiError(400, "First time stop then start time"));
        }
        const checkIn = new UserlogModel({
            empId: req.id,
            date: currentDateWithoutTime,
            timeBlock: [{ startTime: currentDate, endTime: null }]
        })
        await checkIn.save()
        res.status(201).json({ statusCode: 201, success: true, message: "Time start" })
    } catch (e) {
        next(new ApiError(400, e.message))
    }
}

async function stopTime(req, res, next) {
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
        if (userlog.timeBlock[userlog.timeBlock.length - 1].endTime !== null) {
            return next(new ApiError(400, "Start timer first"));
        }
        if (userlog.timeBlock[userlog.timeBlock.length - 1].endTime === null) {
            userlog.timeBlock[userlog.timeBlock.length - 1].endTime = currentDate;
            await userlog.save();
        }
        return res
            .status(200)
            .json({
                statusCode: 200,
                success: true,
                message: "Time stop"
            });
    } catch (e) {
        next(new ApiError(400, e.message))
    }
}

async function reportingTime(req, res, next) {
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
            for (let i = 0; i < findUserLog.timeBlock.length; i++) {
                time += Math.floor((findUserLog.timeBlock[i].endTime ?? currentDate) - findUserLog.timeBlock[i].startTime);
            }
            if (findUserLog.timeBlock[findUserLog.timeBlock.length - 1].endTime === null) {
                return res.
                    status(200).
                    json({
                        statusCode: 200,
                        success: true,
                        data: {
                            isTotalTimeRunning: true,
                            totalReportingTime: Math.floor(time / 1000),
                            hours: Math.floor(time / 3600000),
                            minutes: Math.floor((time / 60000) % 60),
                            seconds: Math.floor((time / 1000) % 60),
                            isLogout: findUserLog.isLogout,
                        }
                    });
            } else {
                return res.
                    status(200).
                    json({
                        statusCode: 200,
                        success: true,
                        data: {
                            isTotalTimeRunning: false,
                            totalReportingTime: Math.floor(time / 1000),
                            hours: Math.floor(time / 3600000),
                            minutes: Math.floor((time / 60000) % 60),
                            seconds: Math.floor((time / 1000) % 60),
                            isLogout: findUserLog.isLogout,
                        }
                    });
            }
        } else {
            return res.
                status(200).
                json({
                    statusCode: 200,
                    success: true,
                    data: {
                        isTotalTimeRunning: false,
                        totalReportingTime: Math.floor(time / 1000),
                        hours: Math.floor(time / 3600000),
                        minutes: Math.floor((time / 60000) % 60),
                        seconds: Math.floor((time / 1000) % 60),
                        isLogout: false,
                    }
                });
        }
    } catch (e) {
        next(new ApiError(400, e.message))
    }
}
async function breakingTime(req, res, next) {
    try {
        const id = req.id;
        let time = 0;
        const currentDate = new Date();

        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const day = currentDate.getDate();

        const currentDateWithoutTime = new Date(year, month, day);

        const findUserLog = await UserlogModel.findOne({ date: currentDateWithoutTime, empId: id });
        if (!findUserLog) {
            return res.status(200).json({
                statusCode: 200,
                success: true,
                data: {
                    isBreakingTimeRunning: false,
                    totalBreakingTime: 0,
                    hours: 0,
                    minutes: 0,
                    seconds: 0,
                }
            })
        }
        for (let i = 0; i < findUserLog.timeBlock.length - 1; i++) {
            time += Math.floor((findUserLog.timeBlock[i + 1].startTime ?? currentDate) - findUserLog.timeBlock[i].endTime);
        }
        if (findUserLog.isLogout) {
            return res.
                status(200).
                json({
                    statusCode: 200,
                    success: true,
                    data: {
                        isBreakingTimeRunning: false,
                        totalBreakingTime: Math.floor(time / 1000),
                        hours: Math.floor(time / 3600000),
                        minutes: Math.floor((time / 60000) % 60),
                        seconds: Math.floor((time / 1000) % 60),
                        isLogout: false,
                    }
                });
        }
        if (findUserLog.timeBlock[findUserLog.timeBlock.length - 1].endTime == null) {
            return res.
                status(200).
                json({
                    statusCode: 200,
                    success: true,
                    data: {
                        isBreakingTimeRunning: false,
                        totalBreakingTime: Math.floor(time / 1000),
                        hours: Math.floor(time / 3600000),
                        minutes: Math.floor((time / 60000) % 60),
                        seconds: Math.floor((time / 1000) % 60),
                        isLogout: false,
                    }
                });
        }
        time += (currentDate - findUserLog.timeBlock[findUserLog.timeBlock.length - 1].endTime);
        return res.
            status(200).
            json({
                statusCode: 200,
                success: true,
                data: {
                    isBreakingTimeRunning: true,
                    totalBreakingTime: Math.floor(time / 1000),
                    hours: Math.floor(time / 3600000),
                    minutes: Math.floor((time / 60000) % 60),
                    seconds: Math.floor((time / 1000) % 60),
                    isLogout: false,
                }
            });
    } catch (e) {
        next(new ApiError(400, e.message))
    }
}

async function getUserLog(req, res, next) {
    try {
        const empId = req.id;
        const currentDate = new Date();

        let year = currentDate.getFullYear();
        let month = currentDate.getMonth() + 1;

        if (req.query.year && !isNaN(req.query.year)) year = parseInt(req.query.year);
        if (req.query.month && !isNaN(req.query.month)) month = parseInt(req.query.month);

        const data = await UserlogModel.aggregate([
            {
                $match: {
                    $expr: {
                        $and: [
                            { $eq: [{ $year: '$date' }, year] },
                            { $eq: [{ $month: '$date' }, month] },
                            { $eq: ["$empId", new mongoose.Types.ObjectId(empId)] }
                        ]
                    },
                },
            },
            {
                $unwind: "$timeBlock"
            },
            {
                $group: {
                    _id: "$date",
                    totalDuration: {
                        $sum: {
                            $cond: {
                                if: { $eq: ['$timeBlock.endTime', null] },
                                then: { $subtract: [new Date(), '$timeBlock.startTime'] },
                                else: { $subtract: ['$timeBlock.endTime', '$timeBlock.startTime'] }
                            }
                        }
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    date: '$_id',
                    totalDurationInSeconds: {
                        $floor: { $divide: ['$totalDuration', 1000] }
                    },
                    seconds: {
                        $floor: { $mod: [{ $divide: ['$totalDuration', 1000] }, 60] }
                    },
                    minutes: {
                        $floor: { $mod: [{ $divide: ['$totalDuration', 60000] }, 60] }
                    },
                    hours: {
                        $floor: { $divide: ['$totalDuration', 3600000] }
                    }

                }
            },
            {
                $sort: {
                    date: 1
                }
            }
        ]).exec()
        res.status(200).json({ statusCode: 200, success: true, data: data })
    } catch (e) {
        next(new ApiError(400, e.message))
    }
}

async function totalWorkingHours(req, res, next) {
    try {
        const empId = req.id;
        const currentDate = new Date();

        let year = currentDate.getFullYear();
        let month = currentDate.getMonth() + 1;

        if (req.query.year && !isNaN(req.query.year)) year = parseInt(req.query.year);
        if (req.query.month && !isNaN(req.query.month)) month = parseInt(req.query.month);

        const data = await UserlogModel.aggregate([
            {
                $match: {
                    $expr: {
                        $and: [
                            { $eq: [{ $year: '$date' }, year] },
                            { $eq: [{ $month: '$date' }, month] },
                            { $eq: ["$empId", new mongoose.Types.ObjectId(empId)] }
                        ]
                    },
                },
            },
            {
                $unwind: "$timeBlock"
            },
            {
                $group: {
                    _id: "$date",
                    totalDuration: {
                        $sum: {
                            $cond: {
                                if: { $eq: ['$timeBlock.endTime', null] },
                                then: { $subtract: [new Date(), '$timeBlock.startTime'] },
                                else: { $subtract: ['$timeBlock.endTime', '$timeBlock.startTime'] }
                            }
                        }
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    date: '$_id',
                    totalDurationInSeconds: {
                        $floor: { $divide: ['$totalDuration', 1000] }
                    },
                    seconds: {
                        $floor: { $mod: [{ $divide: ['$totalDuration', 1000] }, 60] }
                    },
                    minutes: {
                        $floor: { $mod: [{ $divide: ['$totalDuration', 60000] }, 60] }
                    },
                    hours: {
                        $floor: { $divide: ['$totalDuration', 3600000] }
                    }

                }
            },
            {
                $sort: {
                    date: 1
                }
            }
        ]).exec()

        let totalSecond = 0;
        for (const e of data) {
            totalSecond += e.totalDurationInSeconds;
        }
        let hours = Math.floor(totalSecond / 3600);
        let minute = Math.floor((totalSecond / 60) % 60);
        res.status(200).json({
            statusCode: 200, success: true, data: {
                hours,
                minute
            }
        })
    } catch (e) {
        next(new ApiError(400, e.message))
    }
}

module.exports = { startTime, stopTime, reportingTime, breakingTime, getUserLog, totalWorkingHours };