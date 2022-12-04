const router = require("express").Router()
const userRoute = require("./user")

// Routes
router.use("/api/user", userRoute)

module.exports = router
