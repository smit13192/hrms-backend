const { Router } = require("express");
const { createCompany, verifyEmail, verifyOtp, updateCompany, addEmployee, viewCompany,deleteCompany, deleteEmployee } = require("../../controller/auth/company_controller");
const multer = require("../../middleware/multer");
const { verifyUser } = require("../../middleware/verify_user");
const { COMPANY_ROLE } = require("../../config/string");

const router = Router();
router.post("/add-company", multer.single("logo"), createCompany)
router.post("/verify-email", verifyEmail)
router.post("/verify-otp", verifyOtp)
router.put("/update-company", verifyUser(COMPANY_ROLE), multer.single("logo"), updateCompany)
router.delete("/", verifyUser(COMPANY_ROLE), deleteCompany)
router.get("/view-company", verifyUser(COMPANY_ROLE), viewCompany)
router.post("/add-employee", verifyUser(COMPANY_ROLE), addEmployee)
router.delete("/delete-employee/:id", verifyUser(COMPANY_ROLE), deleteEmployee)

module.exports = router;