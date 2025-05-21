const express = require('express')
const router = express.Router()

const { addNewSalesAgent, allSalesAgent, deleteSalesAgentById } = require('../controller/salesAgentController.js')
const authMiddleware = require('../middleware/authMiddleware.js')

router.post("/",authMiddleware, addNewSalesAgent)
router.get("/", authMiddleware, allSalesAgent)
router.delete("/:salesAgentId",authMiddleware,  deleteSalesAgentById)

module.exports = router