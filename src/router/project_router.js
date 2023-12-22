const {Router}=require("express")
const {addProject,getProject,updateProject,deleteProject}=require("../controller/project_collection")
const {verifyUser}=require("../middleware/verify_user")
const {EMPLOYEE_ROLE,COMPANY_ROLE}=require("../config/string")

const router = Router();

router.post("/add", verifyUser(COMPANY_ROLE),addProject)
router.get("/", verifyUser(COMPANY_ROLE),getProject)
router.put("/update/:id", verifyUser(COMPANY_ROLE),updateProject)
router.delete("/delete/:id", verifyUser(COMPANY_ROLE),deleteProject)

module.exports = router