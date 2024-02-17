const { Router } = require("express")
const { startTime, stopTime, reportingTime, getUserLog } = require("../controller/userlog_controller")
const { EMPLOYEE_ROLE } = require("../config/string")
const { verifyUser } = require("../middleware/verify_user")

const router = Router()

router.post("/start-time", verifyUser(EMPLOYEE_ROLE), startTime)
router.post("/stop-time", verifyUser(EMPLOYEE_ROLE), stopTime)
router.get("/reporting-time", verifyUser(EMPLOYEE_ROLE), reportingTime)
router.get("/", verifyUser(EMPLOYEE_ROLE), getUserLog)

module.exports = router