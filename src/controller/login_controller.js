const ApiError = require("../utils/error")
const {compareHash} = require("../utils/hash")
const companies = require("../model/company_model")
const {createToken}=require("../authentication/jwtToken")

async function login(req, res, next) {
    try {
        const { email } = req.body
        const { password } = req.body

        const findEmail = await companies.findOne({ email })
        if (findEmail) {
            const comparePass=compareHash(password, findEmail.password)
            if (comparePass===true) {
                const token = createToken({ _id: findEmail._id });
                res.status(200).send({success:true,message:"login succesfully",token:token})
            }
            else {
                res.status(401).send("wrong details")
            }
        }
        else {
            res.status(401).send("wrong details")
        }
    } catch (error) {
        return next(new ApiError(400, error.message))
    }
}

module.exports={login}