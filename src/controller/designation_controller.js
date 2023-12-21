const ApiError = require("../utils/error")
const DesignationModel = require("../model/designation_model")

async function addDesignation(req, res, next) {
    try {
        const designation = new DesignationModel(req.body)
        await designation.save()
        res.status(201).json({ success: true, data: designation, message: "designation added successfully" })
    } catch (error) {
        return next(new ApiError(400, error.message))
    }
}

async function getDesignation(req, res, next) {
    try {
        const designations = await DesignationModel.find({})
        res.status(200).json({ success: true, data: designations })
    } catch (error) {
        return next(new ApiError(400, error.message))
    }
}

async function updateDesignation(req, res, next) {
    try {
        const designation = await DesignationModel.findByIdAndUpdate({ _id: req.params.id }, { $set: { name: req.body.name } }, { new: true })
        res.status(200).json({ success: true, data: designation, message: "update designation succesfully" })
    } catch (error) {
        return next(new ApiError(400, error.message))
    }
}

async function deleteDesignation(req, res, next) {
    try {
        const designation = await DesignationModel.findByIdAndDelete({ _id: req.params.id })
        res.status(200).json({ success: true, message: "designation delete successfully" });
    } catch (error) {
        return next(new ApiError(400, error.message))
    }
}

module.exports = { addDesignation, getDesignation, updateDesignation, deleteDesignation }