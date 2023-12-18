const CompanyModel = require("../../model/company_model");
const ApiError = require("../../utils/error")
const cloudinary = require("../../utils/cloudinary");
const fs = require("fs");

async function createCompany(req, res, next) {
    try {
        const { email } = req.body;
        const findCompany = await CompanyModel.findOne({ email });
        if (findCompany) {
            return next(new ApiError(400, "Email already exist"));
        }
        const file = req.file;
        if (!file) {
            return next(new ApiError(403, "Company logo is required"));
        }
        const path = file.path;
        const result = await cloudinary.uploader.upload(path);
        req.body.logo = result.secure_url;
        req.body.publicId = result.public_id;
        fs.unlinkSync(path);
        const company = new CompanyModel(req.body);
        await company.save();
        res.status(201).json({ success: true, message: "New comapany created" });
    } catch (e) {
        next(new ApiError(400, e.message));
    }
}

module.exports = { createCompany }