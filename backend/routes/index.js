const router = require("express").Router()
const authRoute = require("./auth")
const userRoute = require("./user")
const cartRoute = require("./cart")
const productRoute = require("./product")

// Routes
router.use("/api/auth", authRoute)
router.use("/api/users", userRoute)
router.use("/api/carts", cartRoute)
router.use("/api/products", productRoute)

module.exports = router
