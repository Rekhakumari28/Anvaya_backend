const express = require('express')
const router  = express.Router()

const {addTag, getAllTag} = require('../controller/tagController.js')
const authMiddleware = require('../middleware/authMiddleware.js')

router.post('/',authMiddleware, addTag)
router.get("/", authMiddleware, getAllTag)

module.exports = router