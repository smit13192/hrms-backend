const { Router } = require("express")
const { login } = require("../controller/login_controller")

const router = Router();

router.post("/login", login)

module.exports = router;