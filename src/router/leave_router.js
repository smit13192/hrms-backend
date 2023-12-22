const {Router}=require("express")
const {}=require("../controller/leave_controller")
const {verifyUser}=require("../middleware/verify_user")
const {EMPLOYEE_ROLE,COMPANY_ROLE}=require("../config/string")

const router=Router()

router.post("/add",verifyUser(EMPLOYEE_ROLE))
router.get("/",verifyUser(COMPANY_ROLE,EMPLOYEE_ROLE),)
router.update("/",verifyUser(COMPANY_ROLE),)
router.delete("/",verifyUser(COMPANY_ROLE),)