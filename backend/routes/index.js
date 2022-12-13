const router = require("express").Router()
const authRoute = require("./auth")
const userRoute = require("./user")

// Routes
router.use("/api/user", userRoute)
router.use("/api/auth", authRoute)

module.exports = router
