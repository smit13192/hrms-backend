const ApiError = require("../utils/error")
const EmployeeModel = require("../model/employee_model")
const cloudinary = require("../utils/cloudinary");
const fs = require("fs");
const { FOLDER_NAME } = require("../config/string");

async function addProfile(req, res, next) {
    try {
        delete req.body.email;
        delete req.body.password;
        const file = req.file;
        if (file) {
            const path = file.path;
            const result = await cloudinary.uploader.upload(path, { folder: FOLDER_NAME });
            req.body.profilePic = result.secure_url;
            req.body.publicId = result.public_id;
            if (req.user.publicId) {
                await cloudinary.uploader.destroy(req.user.publicId);
            }
            fs.unlinkSync(path);
        }
        const id = req.id
        const profile = await EmployeeModel.findByIdAndUpdate({ _id: id }, { $set: req.body }, { new: true })
        res.status(200).json({ statusCode: 200, success: true, data: profile, message: "profile details added successfully" })
    } catch (e) {
        next(new ApiError(400, e.message))
    }
}

module.exports = { addProfile }