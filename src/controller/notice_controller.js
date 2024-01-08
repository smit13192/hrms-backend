const ApiError=require("../utils/error")
const noticeModel=require("../model/notice_model")
const { EMPLOYEE_ROLE } = require("../config/string")
const EmployeeModel=require("../model/employee_model")
const {noticeValidation}=require("../config/joi.validation")

async function addNotice(req,res,next){
    try {
        req.body.companyId=req.id
        
        const noticeValid=noticeValidation.validate(req.body)
        if(noticeValid.error){
            return next(new ApiError(403,noticeValid.error.details[0].message))
        }

        const notice=new noticeModel(req.body)
        await notice.save()
        res.status(201).json({success:true,data:notice,message:"notice added successfully"})
    } catch (e) {
         next(new ApiError(400,e.message))
    }
}

async function getNotice(req,res,next){
    try {
        let companyId = req.id;
        if(req.role === EMPLOYEE_ROLE) {
            companyId = await EmployeeModel.getCompanyId(req.id);
        }
        const notice = await noticeModel.find({ companyId });
        res.status(200).json({ success: true, date: notice });
    } catch (e) {
         next(new ApiError(400,e.message))
    }
}

async function updateNotice(req,res,next){
    try {
        const notice = await noticeModel.findByIdAndUpdate({ _id: req.params.id }, { $set: req.body }, { new: true })
        res.status(200).json({ success: true, data: notice, message: "notice update sucessfully" })
    } catch (e) {
         next(new ApiError(400,e.message))
    }
}

async function deleteNotice(req, res, next) {
    try {
        await noticeModel.findByIdAndDelete({ _id: req.params.id })
        res.status(200).json({ success: true, message: "notice delete sucessfully" })
    } catch (error) {
         next(new ApiError(400, e.message))
    }
}

module.exports={addNotice,getNotice,updateNotice,deleteNotice}