const ApiError=require("../utils/error")
const { EMPLOYEE_ROLE, COMPANY_ROLE } = require("../config/string")
const EmployeeModel=require("../model/employee_model")
const cloudinary = require("../utils/cloudinary");
const fs = require("fs");
const path = require("path");

async function addOrUpdateProfile(req,res,next){
    try {
        if(req.role===EMPLOYEE_ROLE){
            console.log(req.file);
            const path = req.file.path;
            const result = await cloudinary.uploader.upload(path);
            req.body.profilePic = result.secure_url;
            req.body.publicId = result.public_id;
            fs.unlinkSync(path);
            const id=req.id
            const profile=await EmployeeModel.findByIdAndUpdate({_id:id},{$set:req.body},{new:true})
            res.status(200).json({success:true,data:profile,message:"profile details added successfully"})
        }
        if(req.role===COMPANY_ROLE){
            const id=req.params.id
            const profile=await EmployeeModel.findByIdAndUpdate({_id:id},{$set:req.body},{new:true})
            res.status(200).json({success:true,data:profile,message:"employee Updated successfully"})
        }
    } catch (e) {
         next(new ApiError(400,e.message))
    }
}


module.exports={addOrUpdateProfile}