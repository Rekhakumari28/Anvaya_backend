const express = require('express')

//lead router
const router = express.Router()

//import routes functions for lead
const  { addNewLead, findAllLeads,  groupedLeadBy, updateLeadById, leadFindById, deleteLeadById ,addComment, getAllComment, sortLeadByPriority, sortLeadByTimeToClose} = require('../controller/leadController.js')

//lead route
router.post("/", addNewLead)
router.get("/", findAllLeads)
router.get("/grouped", groupedLeadBy)
router.get("/priority", sortLeadByPriority)
router.get("/timeToClose", sortLeadByTimeToClose)
router.patch("/:leadId", updateLeadById)
router.get("/:leadId", leadFindById)
router.delete("/:leadId", deleteLeadById)
//comment route
router.post("/comments",addComment)
router.get("/comments", getAllComment)

router.route("/:leadId/comments").post(addComment)
router.route("/:leadId/comments").get(getAllComment)
module.exports = router
