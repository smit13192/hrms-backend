const { Router } = require("express");
const authRouter = require("./auth/auth_router");
const companyRouter = require("./auth/company_router");
const workCategoryRouter = require("./work_category_router");
const loginRouter = require("./login_router");
const departmentRouter=require("./department_router")
const designationRouter=require("./designation_route")

const router = Router();
router.use(authRouter);
router.use("/company",companyRouter);
router.use("/work-category",workCategoryRouter);
router.use("/login",loginRouter)
router.use("/department",departmentRouter)
router.use("/designation",designationRouter)


module.exports = router;