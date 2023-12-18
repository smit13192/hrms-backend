const { Router } = require("express");
const { createCompany } = require("../../controller/auth/company_controller");
const multer = require("../../middleware/multer");

const router = Router();
router.post("/add-company", multer.single("logo"), createCompany)

module.exports = router;