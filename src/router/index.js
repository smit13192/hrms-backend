const { Router } = require("express");
const companyRouter = require("./auth/company_router");
const workCategoryRouter = require("./work_category_router");
const loginRouter = require("./login_router");
const departmentRouter = require("./department_router")
const designationRouter = require("./designation_route")

const router = Router();
router.use("/company", companyRouter);
router.use("/work-category", workCategoryRouter);
router.use(loginRouter)
router.use("/department", departmentRouter)
router.use("/designation", designationRouter)


module.exports = router;