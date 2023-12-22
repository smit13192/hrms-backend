const ApiError = require("../utils/error")
const holidayModel=require("../model/holiday_model")

async function addHoliday(req,res,next){
    try {
        req.body.company_id=req.id
        const holiday=new holidayModel(req.body)
        await holiday.save()
        res.status(201).json({success:true,data:holiday,message:"holiday added sucessfully"})
    } catch (e) {
       return next(new ApiError(400,e.message)) 
    }
}

async function getHoliday(req,res,next){
    try {
        const holidays=await holidayModel.find({company_id:req.id})
        res.status(200).json({success:true,holidays})
    } catch (error) {
        return next(new ApiError(400,e.message)) 
    }
}

async function updateHoliday(req,res,next){
    try {
        const holiday=await holidayModel.findByIdAndUpdate({_id:req.params.id},{$set:req.body},{new:true})
        res.status(200).json({success:true,data:holiday,message:"holiday update sucessfully"})
    } catch (error) {
        return next(new ApiError(400,e.message)) 
    }
}

async function deleteHoliday(req,res,next){
    try {
        const holiday=await holidayModel.findByIdAndDelete({_id:req.params.id})
        res.status(200).json({success:true,message:"holiday delete sucessfully"})
    } catch (error) {
        return next(new ApiError(400,e.message)) 
    }
}

module.exports={addHoliday,getHoliday,updateHoliday,deleteHoliday}