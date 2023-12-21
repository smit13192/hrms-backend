const {Router}=require("express")
const {addDepartment,getDepartment,updateDepartment,deleteDepartment}=require("../controller/department_controller")

const router=Router()

router.post("/add",addDepartment)
router.get("/",getDepartment)
router.put("/update/:id",updateDepartment)
router.delete("/delete/:id",deleteDepartment)

module.exports=router