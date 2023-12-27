const {Router}=require("express")
const {addProfile}=require("../controller/profile_controller")
const {viewCompanyOrProfile}=require("../controller/auth/company_controller")
const { EMPLOYEE_ROLE } = require("../config/string")
const {verifyUser}=require("../middleware/verify_user")
const multer = require("../middleware/multer");


const router=Router()

router.get("/",verifyUser(EMPLOYEE_ROLE),viewCompanyOrProfile)
router.post("/add",verifyUser(EMPLOYEE_ROLE), multer.single("profilePic"),addProfile)

module.exports=router