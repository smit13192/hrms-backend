const ApiError = require("../utils/error")
const TeamModel=require("../model/team_model")
const { EMPLOYEE_ROLE } = require("../config/string");

async function addTeam(req,res,next){
    try {
        req.body.companyId=req.id
        const team=new TeamModel(req.body)
        await team.save()
        res.status(201).json({success:true,data:team,message:"team created successfully"})
    } catch (e) {
        return next(new ApiError(400,e.message))
    }
}

async function getTeam(req,res,next){
    try {
        if(req.role===EMPLOYEE_ROLE){
            const teams=await TeamModel.find({
                $or:[
                    {members:req.id},
                    {leader:req.id}
                ]
            })
            res.status(200).json({success:true,data:teams})
        }
        else{
            const teams=await TeamModel.find({companyId:req.id})
            res.status(200).json({success:true,data:teams})
        }
    } catch (e) {
        return next(new ApiError(400,e.message))
    }
}

async function updateTeam(req,res,next){
    try {
        const team = await TeamModel.findByIdAndUpdate({ _id: req.params.id }, { $set: req.body }, { new: true });
        res.status(200).json({ success: true, data: team, message: "team details  updated successfully" });
    } catch (e) {
        return next(new ApiError(400,e.message))
    }
}

async function deleteTeam(req,res,next){
    try {
        await TeamModel.findByIdAndDelete({ _id: req.params.id })
        res.status(200).json({ success: true, message: "team delete sucessfully" })
    } catch (e) {
        return next(new ApiError(400,e.message))
    }
}

module.exports={addTeam,getTeam,updateTeam,deleteTeam}