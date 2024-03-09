const { Router } = require("express")
const { login, employeeLogin } = require("../controller/login_controller")

const router = Router();

router.post("/login", login)
router.post("/employee-login", employeeLogin)

module.exports = router;