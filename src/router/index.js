const { Router } = require("express");
const companyRouter = require("./auth/company_router");
const workCategoryRouter = require("./work_category_router");
const loginRouter = require("./login_router");
const departmentRouter = require("./department_router")
const designationRouter = require("./designation_route")
const holidayRouter=require("./holiday_route")
const projectRouter=require("./project_router")
const leaveRouter=require("./leave_router")
const noticeRouter=require("./notice_router")

const router = Router();
router.use("/company", companyRouter);
router.use("/work-category", workCategoryRouter);
router.use(loginRouter)
router.use("/department", departmentRouter)
router.use("/designation", designationRouter)
router.use("/holiday", holidayRouter)
router.use("/project", projectRouter)
router.use("/leave", leaveRouter)
router.use("/notice",noticeRouter)

module.exports = router;