const router = require("express").Router()
const CryptoJS = require("crypto-js")

const {
    verifyTokenAndAuthorization,
    verifyTokenAndAdmin,
} = require("./verifyToken")

const { PASS_SEC } = require("dotenv")
const User = require("../models/User")

router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
    const { id } = req.params
    const { password } = req.body
    if (password) {
        password = CryptoJS.AES.encrypt(password, PASS_SEC).toString()
    }

    try {
        const updatedUser = await User.findByIdAndUpdate(
            id,
            { $set: req.body },
            { new: true }
        )

        res.status(200).json(updatedUser)
    } catch (error) {
        res.status(500).json(error)
    }
})

router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {
    const { id } = req.params
    try {
        await User.findByIdAndDelete(id)

        res.status(200).json("User has been deleted")
    } catch (error) {
        res.status(500).json(error)
    }
})

// User with :id
router.get("/find/:id", verifyTokenAndAdmin, async (req, res) => {
    const { id } = req.params
    try {
        const user = await User.findById(id)

        const { password, ...others } = user._doc

        res.status(200).json({ ...others })
    } catch (error) {
        res.status(500).json(error)
    }
})

// All users
router.get("/", verifyTokenAndAdmin, async (req, res) => {
    const query = req.query.new
    try {
        const user = query
            ? await User.find().sort({ _id: -1 }).limit(5)
            : await User.find()

        res.status(200).json(users)
    } catch (error) {
        res.status(500).json(error)
    }
})

router.get("/stats", verifyTokenAndAdmin, async (req, res) => {
    const date = new Date()
    const lastYear = new Date(date.setFullYear(date.getFullYear() - 1))

    try {
        const data = await User.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: lastYear,
                    },
                },
            },
            {
                $project: {
                    month: {
                        $month: "$createdAt",
                    },
                },
            },
            {
                $group: {
                    _id: "$month",
                    total: {
                        $sum: 1,
                    },
                },
            },
        ])

        res.status(200).json(data)
    } catch (error) {
        res.status(500).json(error)
    }
})

module.exports = router
