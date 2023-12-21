const ApiError = require("../utils/error")
const { compareHash } = require("../utils/hash")
const CompanyModel = require("../model/company_model")
const { COMPANY_ROLE } = require("../config/string")
const { createToken } = require("../authentication/jwt_token")

async function login(req, res, next) {
    try {
        const { email, password } = req.body
        const findUser = await CompanyModel.findOne({ email })
        if (findUser) {
            const comparePass = compareHash(password, findUser.password)
            if (comparePass === true) {
                const token = createToken({ _id: findUser._id, role: COMPANY_ROLE });
                res.status(200).json({ success: true, message: "login succesfully", token: token })
            }
            else {
                return next(new ApiError(401, "Password is wrong"))
            }
        }
        else {
            return next(new ApiError(401, "Email is not exist"))
        }
    } catch (error) {
        return next(new ApiError(400, error.message))
    }
}

module.exports = { login }