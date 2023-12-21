const CompanyModel = require("../../model/company_model");
const OtpModel = require("../../model/otp_model");
const ApiError = require("../../utils/error")
const cloudinary = require("../../utils/cloudinary");
const generateOtp = require("../../utils/generate_otp");
const transporter = require("../../utils/transporter");
const fs = require("fs");
const path = require("path");

async function verifyEmail(req, res, next) {
    try {
        const { email } = req.body;
        const filePath = path.join(__dirname, "../../../public/otp.html");
        let htmlData = fs.readFileSync(filePath, "utf-8");
        const otp = generateOtp();
        htmlData = htmlData.replace("${otp}", otp);
        transporter.sendMail({
            to: email,
            subject: "Verify email",
            html: htmlData,
        }, async (err, _result) => {
            if (err) {
                return next(new ApiError(400, err.message));
            }
            await OtpModel.deleteMany({ email: email })
            const otpModel = new OtpModel({ email, otp });
            await otpModel.save();
            setTimeout(async () => {
                await OtpModel.findByIdAndDelete(otpModel._id);
            }, 1000 * 60);
            res.status(200).json({ success: true, message: "Otp send your email" });
        });
    } catch (e) {
        next(new ApiError(400, e.message));
    }
}

async function verifyOtp(req,res,next){

}

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

module.exports = { verifyEmail, verifyOtp, createCompany };