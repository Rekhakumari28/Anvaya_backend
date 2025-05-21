const express = require('express')
const router = express.Router()
const userController = require("../controller/userController.js")
const authMiddleware = require('../middleware/authMiddleware.js')

router.post("/register", userController.registerUser)
router.post("/login", userController.userLogin)

router.get("/profile",authMiddleware , userController.userProfile)

router.get('/',authMiddleware, userController.getAllUser)

module.exports = router