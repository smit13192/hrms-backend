const Joi = require("joi");
const { joiPasswordExtendCore } = require('joi-password');
const JoiPassword = Joi.extend(joiPasswordExtendCore);

const createCompanyValidation=Joi.object().keys({
    logo: Joi.string(),
    email: Joi.string().email().required(),
    password: JoiPassword.string()
    .min(6)
    .minOfSpecialCharacters(1)
    .minOfLowercase(1)
    .minOfUppercase(1)
    .minOfNumeric(1)
    .noWhiteSpaces()
    .required(),
    name: Joi.string().required(),
    founder: Joi.string().required(),
    startDate: Joi.date().required(),
    minStaff: Joi.number().integer().required(),
    maxStaff: Joi.number().integer().required(),
    workingHour: Joi.number().integer().required(),
    address: Joi.string().required(),
    landmark: Joi.string().required(),
    country: Joi.string().required(),
    state: Joi.string().required(),
    city: Joi.string().required(),
    pincode: Joi.string().required(),
    workCategory: Joi.array().items(Joi.string()),
    publicId: Joi.string()
})

module.exports={createCompanyValidation}