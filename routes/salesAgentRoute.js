const express = require('express')
const router = express.Router()

const { addNewSalesAgent, allSalesAgent, deleteSalesAgentById } = require('../controller/salesAgentController.js')

router.post("/", addNewSalesAgent)
router.get("/", allSalesAgent)
router.delete("/:salesAgentId", deleteSalesAgentById)

module.exports = router