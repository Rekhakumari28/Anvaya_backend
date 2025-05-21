const express = require("express")
const router = express.Router()

const { getReportLastWeek, getPipeline, getLeadClosedByAgent } = require("../controller/reportController.js")
const authMiddleware = require("../middleware/authMiddleware.js")

router.get("/last-week", authMiddleware, getReportLastWeek )
router.get("/pipeline", authMiddleware, getPipeline )
router.get("/closed-by-agent",authMiddleware,  getLeadClosedByAgent )

module.exports = router