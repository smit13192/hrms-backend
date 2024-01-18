const {Router}=require("express")
const {addOrUpdateProfile}=require("../controller/profile_controller")
const {viewCompanyOrProfile,changePassword}=require("../controller/auth/company_controller")
const { EMPLOYEE_ROLE, COMPANY_ROLE } = require("../config/string")
const {verifyUser}=require("../middleware/verify_user")
const multer = require("../middleware/multer");


const router=Router()

router.get("/",verifyUser(EMPLOYEE_ROLE),viewCompanyOrProfile)
router.post("/add",verifyUser(EMPLOYEE_ROLE), multer.single("profilePic"),addOrUpdateProfile)
router.post("/changePassword",verifyUser(EMPLOYEE_ROLE),changePassword)


module.exports=router