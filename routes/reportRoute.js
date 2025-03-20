const express = require("express")
const router = express.Router()

const { getReportLastWeek, getPipeline, getLeadClosedByAgent } = require("../controller/reportController.js")


router.get("/last-week", getReportLastWeek )
router.get("/pipeline", getPipeline )
router.get("/closed-by-agent", getLeadClosedByAgent )

module.exports = router