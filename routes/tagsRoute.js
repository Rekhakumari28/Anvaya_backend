const express = require('express')
const router  = express.Router()

const {addTag, getAllTag} = require('../controller/tagController.js')

router.post('/',addTag)
router.get("/", getAllTag)

module.exports = router