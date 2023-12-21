const { Router } = require("express");
const { createCompany, verifyEmail } = require("../../controller/auth/company_controller");
const multer = require("../../middleware/multer");

const router = Router();
router.post("/add-company", multer.single("logo"), createCompany)
router.post("/verify-email", verifyEmail)

module.exports = router;