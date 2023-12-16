const { Router } = require("express");
const { verifyEmail } = require("../controller/authController");

const router = Router();
router.post("/verify-email",verifyEmail);

module.exports = router;