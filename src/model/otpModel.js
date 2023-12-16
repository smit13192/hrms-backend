const { Schema, model } = require ('mongoose');

const OTP = new Schema({
    email: {
        type: String,
        required: true,
    },
    otp: {
        type: String,
    }
},
    { timestamps: true },
);

const OtpModel = model('otps', OTP);

module.exports = OtpModel;