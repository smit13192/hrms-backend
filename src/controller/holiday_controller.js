const ApiError = require("../utils/error")
const HolidayModel = require("../model/holiday_model")

async function addHoliday(req, res, next) {
    try {
        req.body.companyId = req.id
        const holiday = new HolidayModel(req.body)
        await holiday.save()
        res.status(201).json({ success: true, data: holiday, message: "holiday added sucessfully" })
    } catch (e) {
        return next(new ApiError(400, e.message))
    }
}

async function getHoliday(req, res, next) {
    try {
        const holidays = await HolidayModel.find({ companyId: req.id })
        res.status(200).json({ success: true, holidays })
    } catch (error) {
        return next(new ApiError(400, e.message))
    }
}

async function updateHoliday(req, res, next) {
    try {
        const holiday = await HolidayModel.findByIdAndUpdate({ _id: req.params.id }, { $set: req.body }, { new: true })
        res.status(200).json({ success: true, data: holiday, message: "holiday update sucessfully" })
    } catch (error) {
        return next(new ApiError(400, e.message))
    }
}

async function deleteHoliday(req, res, next) {
    try {
        await HolidayModel.findByIdAndDelete({ _id: req.params.id })
        res.status(200).json({ success: true, message: "holiday delete sucessfully" })
    } catch (error) {
        return next(new ApiError(400, e.message))
    }
}

module.exports = { addHoliday, getHoliday, updateHoliday, deleteHoliday }