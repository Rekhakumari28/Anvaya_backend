const express = require('express')

//lead router
const leadRouter = express.Router()

//comment routes
const commentRouter  = express.Router()

//import routes functions for lead
const  { addNewLead, findAllLeads, filterdLead, updateLeadById, leadFindById, deleteLeadById } = require('../controller/leadController')

//import routes functions for comment
const {addComment, getAllComment} = require('../controller/commentController')

//lead route
leadRouter.post("/", addNewLead)
leadRouter.get("/", findAllLeads)
leadRouter.get("", filterdLead)
leadRouter.put("/:leadId", updateLeadById)
leadRouter.get("/:leadId", leadFindById)
leadRouter.delete("/:leadId", deleteLeadById)


//comment route

leadRouter.get("/:leadId/comment", leadFindById.addComment)
leadRouter.get("/:leadId comment", leadFindById.getAllComment)


module.exports = commentRouter


module.exports = leadRouter