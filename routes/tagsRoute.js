const express = require('express')
const router  = express.Router()

const {addTag, getAllTag} = require('../controller/tagController')

router.post('/',addTag)
router.get("/", getAllTag)

module.exports = router