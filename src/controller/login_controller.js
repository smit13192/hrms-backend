const ApiError = require("../utils/error");
const { compareHash } = require("../utils/hash");
const CompanyModel = require("../model/company_model");
const { COMPANY_ROLE, EMPLOYEE_ROLE } = require("../config/string");
const { createToken } = require("../authentication/jwt_token");
const EmployeeModel = require("../model/employee_model");

async function login(req, res, next) {
    try {
        const { email, password } = req.body;
        const findCompany = await CompanyModel.findOne({ email });
        if (findCompany) {
            const comparePass = compareHash(password, findCompany.password);
            if (comparePass === true) {
                const token = createToken({ _id: findCompany._id, role: COMPANY_ROLE }, '24h');
                res.status(200).json({ statusCode: 200, success: true, message: "login succesfully", token: token });
            }
            else {
                return next(new ApiError(400, "Password is wrong"))
            }
        }
        else {
            const findEmployee = await EmployeeModel.findOne({ email });
            if (findEmployee) {
                const comparePass = compareHash(password, findEmployee.password);
                if (comparePass === true) {
                    const token = createToken({ _id: findEmployee._id, role: EMPLOYEE_ROLE }, '24h');
                    res.status(200).json({ statusCode: 200, success: true, message: "login succesfully", token: token });
                }
                else {
                    return next(new ApiError(400, "Password is wrong"))
                }
            } else {
                return next(new ApiError(400, "Email not exist"))
            }
        }
    } catch (error) {
        next(new ApiError(400, error.message))
    }
}

async function employeeLogin(req, res, next) {
    try {
        const { email, password } = req.body;
        const findEmployee = await EmployeeModel.findOne({ email });
        if (findEmployee) {
            const comparePass = compareHash(password, findEmployee.password);
            if (comparePass === true) {
                const token = createToken({ _id: findEmployee._id, role: EMPLOYEE_ROLE });
                res.status(200).json({ statusCode: 200, success: true, message: "login succesfully", token: token });
            }
            else {
                return next(new ApiError(400, "Password is wrong"))
            }
        } else {
            return next(new ApiError(400, "Email not exist"))
        }
    } catch (error) {
        next(new ApiError(400, error.message))
    }
}

module.exports = { login, employeeLogin }