const { Router } = require("express")
const { checkIn, checkOut, getUserlog, getTime } = require("../controller/userlog_controller")
const { COMPANY_ROLE, EMPLOYEE_ROLE } = require("../config/string")
const { verifyUser } = require("../middleware/verify_user")

const router = Router()

router.post("/checkIn", verifyUser(EMPLOYEE_ROLE), checkIn)
router.post("/checkOut", verifyUser(EMPLOYEE_ROLE), checkOut)
router.get("/get-time", verifyUser(EMPLOYEE_ROLE), getTime)
router.get("/", verifyUser([COMPANY_ROLE, EMPLOYEE_ROLE]), getUserlog)

module.exports = router
