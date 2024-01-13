const ApiError = require("../utils/error")
const EmployeeModel = require("../model/employee_model")
const UserlogModel = require("../model/userlog_model");
const ProjectModel = require("../model/project_model");


async function dashboard(req,res,next){
    try {
        const today= new Date().toISOString().split('T')[0]; 

        const allEmployees=await EmployeeModel.find({company:req.id})

        const presentEmployees = await Promise.all(
            allEmployees.map(async (employee) => {
              const presentEmp = await UserlogModel.find({ empId: employee._id, date: today });
              return presentEmp.length > 0 ? employee._id : null;
            })
        );
        const numberOfPresentEmp=presentEmployees.filter(Boolean).length
        const numberOfAbsentEmp=presentEmployees.filter(emp => emp === null).length

        const projects=await ProjectModel.find({companyId:req.id,status:"running"})
        const numberOfProjects=projects.filter(Object).length

        res.status(200).json({success:true,numberOfPresentEmp,numberOfAbsentEmp,numberOfProjects})

    } catch (e) {
         next(new ApiError(400,e.message))
    }
}

module.exports={dashboard}