const router = require("express").Router()
const User = require("../models/User")
const CryptoJS = require("crypto-js")
const jwt = require("jsonwebtoken")

const { PASS_SEC, JWT_SEC } = require("dotenv")

// Register
router.post("/register", async (req, res) => {
    const { username, email, password } = req.body

    const newUser = new User({
        username: username,
        email: email,
        password: CryptoJS.AES.encrypt(password, PASS_SEC).toString(),
    })

    try {
        const savedUser = await newUser.save()
        res.status(201).json(savedUser)
    } catch (error) {
        res.status(500).json(error)
    }
})

// Login
router.post("/login", async (req, res) => {
    const { username, password } = req.body

    try {
        const user = await User.findOne({ username: username })
        const pass = CryptoJS.AES.decrypt(password, PASS_SEC).toString(
            CryptoJS.enc.Utf8
        )

        !user && res.status(401).json("Wrong creentials!")
        pass !== password && res.status(401).json("Wrong creentials!")

        const accessToken = jwt.sign(
            {
                id: user._id,
                isAdmin: user.isAdmin,
            },
            JWT_SEC,
            { expiresIn: "3d" }
        )

        const { password, ...others } = user._doc

        res.status(200).json({ ...others, accessToken })
    } catch (error) {
        res.status(500).json(error)
    }
})

module.exports = router
