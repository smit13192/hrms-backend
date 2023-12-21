const { Router } = require("express");
const { createCompany, verifyEmail, verifyOtp, updateCompany } = require("../../controller/auth/company_controller");
const multer = require("../../middleware/multer");
const { verifyUser } = require("../../middleware/verify_user");
const { COMPANY_ROLE } = require("../../config/string");

const router = Router();
router.post("/add-company", multer.single("logo"), createCompany)
router.post("/verify-email", verifyEmail)
router.post("/verify-otp", verifyOtp)
router.put("/update-company", verifyUser(COMPANY_ROLE), multer.single("logo"), updateCompany)

module.exports = router;