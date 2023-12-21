const { Router } = require("express")
const { addDesignation, getDesignation, updateDesignation, deleteDesignation } = require("../controller/designation_controller")

const router = Router()

router.post("/add", addDesignation)
router.get("/", getDesignation)
router.put("/update/:id", updateDesignation)
router.delete("/delete/:id", deleteDesignation)

module.exports = router