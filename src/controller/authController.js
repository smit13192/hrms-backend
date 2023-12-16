const path = require("path");
const fs = require('fs');
const transporter = require("../utils/transporter")
const generateOtp = require("../utils/generateOtp");
const OtpModel = require("../model/otpModel");
const ApiError = require("../utils/error");

module.exports.verifyEmail = function (req, res, next) {
    const { email } = req.body;

    const filePath = path.join(__dirname, `../../public/otp.html`);
    let fileContent = fs.readFileSync(filePath, 'utf-8');

    const otp = generateOtp();
    fileContent = fileContent.replace('${otp}', otp);

    transporter.sendMail({
        to: email,
        subject: "Verify email",
        html: fileContent,
    }, async (error, _result) => {
        if (error) {
            return next(new ApiError(400, "Email no sent successfully try again"));
        } else {
            await OtpModel.deleteMany({ email })
            const otpModel = new OtpModel({ email, otp: otp })
            await otpModel.save()

            setTimeout(async () => {
                await OtpModel.deleteMany({ email })
            }, 1000 * 60)
            return res.json({ success: true, message: "Email sent successfully" });
        }
    })
}