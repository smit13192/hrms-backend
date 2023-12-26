const {Router}=require("express")
const {addProfile,getProfile}=require("../controller/profile_controller")
const { EMPLOYEE_ROLE } = require("../config/string")
const {verifyUser}=require("../middleware/verify_user")

const router=Router()

router.get("/",verifyUser(EMPLOYEE_ROLE),getProfile)
router.post("/add",verifyUser(EMPLOYEE_ROLE),addProfile)
router.post("/update",verifyUser(EMPLOYEE_ROLE),addProfile)

module.exports=router