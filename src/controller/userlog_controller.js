const ApiError = require("../utils/error")
const UserlogModel = require("../model/userlog_model")
const mongoose = require("mongoose")

async function startTime(req, res, next) {
    try {
        const currentDate = new Date();

        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const day = currentDate.getDate();

        const currentDateWithoutTime = new Date(year, month, day);

        const findCurrentDateUserlog = await UserlogModel.findOne({ date: currentDateWithoutTime, empId: req.id });
        if (findCurrentDateUserlog) {
            if (findCurrentDateUserlog.timeBlock[findCurrentDateUserlog.timeBlock.length - 1].endTime !== null) {
                findCurrentDateUserlog.timeBlock.push({ startTime: currentDate, endTime: null });
                await findCurrentDateUserlog.save();
                return res.status(200).json({ success: true, message: "Time start" })
            }
            return next(new ApiError(400, "First time stop then start time"));
        }
        const checkIn = new UserlogModel({
            empId: req.id,
            date: currentDateWithoutTime,
            timeBlock: [{ startTime: currentDate, endTime: null }]
        })
        await checkIn.save()
        res.status(201).json({ success: true, message: "Time start" })
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
        if (userlog.timeBlock[userlog.timeBlock.length - 1].endTime === null) {
            userlog.timeBlock[userlog.timeBlock.length - 1].endTime = currentDate;
            await userlog.save();
        }
        return res
            .status(200)
            .json({
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
                time += Math.floor(((findUserLog.timeBlock[i].endTime ?? currentDate) - findUserLog.timeBlock[i].startTime) / 1000);
            }
            if (findUserLog.timeBlock[findUserLog.timeBlock.length - 1].endTime === null) {
                return res.
                    status(200).
                    json({
                        success: true,
                        data: {
                            isTotalTimeRunning: true,
                            totalReportingTime: time,
                            hours: Math.floor(time / (60 * 60)),
                            minutes: Math.floor((time % (60 * 60)) / 60),
                            seconds: Math.floor(time % 60),
                        }
                    });
            } else {
                return res.
                    status(200).
                    json({
                        success: true,
                        data: {
                            isTotalTimeRunning: false,
                            totalReportingTime: time,
                            hours: Math.floor(time / (60 * 60)),
                            minutes: Math.floor((time % (60 * 60)) / 60),
                            seconds: Math.floor(time % 60),
                        }
                    });
            }
        } else {
            return res.
                status(200).
                json({
                    success: true,
                    data: {
                        isTotalTimeRunning: false,
                        totalReportingTime: time,
                        hours: Math.floor(time / (60 * 60)),
                        minutes: Math.floor((time % (60 * 60)) / 60),
                        seconds: Math.floor(time % 60),
                    }
                });
        }
    } catch (e) {
        next(new ApiError(400, e.message))
    }
}

async function getUserLog(req, res, next) {
    try {
        const empId = req.id;
        const currentDate = new Date();

        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();

        const data = await UserlogModel.aggregate([
            {
                $match: {
                    $expr: {
                        $and: [
                            { $eq: [{ $year: '$date' }, year] },
                            { $eq: [{ $month: '$date' }, month + 1] },
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
        res.status(200).json({ success: true, data: data })
    } catch (e) {
        next(new ApiError(400, e.message))
    }
}

module.exports = { startTime, stopTime, reportingTime, getUserLog };