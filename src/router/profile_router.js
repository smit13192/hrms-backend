const {Router}=require("express")
const {addProfile,getProfile}=require("../controller/profile_controller")
const { EMPLOYEE_ROLE } = require("../config/string")
const {verifyUser}=require("../middleware/verify_user")
const multer = require("../middleware/multer");


const router=Router()

router.get("/",verifyUser(EMPLOYEE_ROLE),getProfile)
router.post("/add",verifyUser(EMPLOYEE_ROLE), multer.single("profilePic"),addProfile)

module.exports=router