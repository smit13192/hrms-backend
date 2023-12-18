const { Router } = require("express");
const authRouter = require("./auth/auth_router");
const companyRouter = require("./auth/company_router");
const workCategoryRouter = require("./work_category_router");

const router = Router();
router.use(authRouter);
router.use("/company",companyRouter);
router.use("/work-category",workCategoryRouter);

module.exports = router;