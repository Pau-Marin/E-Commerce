const router = require("express").Router()
const CryptoJS = require("crypto-js")

const {
    verifyTokenAndAuthorization,
    verifyTokenAndAdmin,
    verifyToken,
} = require("./verifyToken")

const { PASS_SEC } = require("dotenv")
const Cart = require("../models/Cart")

router.post("/", verifyToken, async (req, res) => {
    const newCart = new Cart(req.body)

    try {
        const savedCart = await newCart.save()
        res.status(200).json(savedCart)
    } catch (error) {
        res.status(500).json(error)
    }
})

router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
    const { id } = req.params

    try {
        const updatedCart = await Cart.findByIdAndUpdate(
            id,
            { $set: req.body },
            { new: true }
        )
        res.status(200).json(updatedCart)
    } catch (error) {
        res.status(500).json(error)
    }
})

router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {
    const { id } = req.params

    try {
        await Cart.findByIdAndDelete(id)
        res.status(200).json("Cart has been deleted")
    } catch (error) {
        res.status(500).json(error)
    }
})

router.get("/find/:userId", verifyTokenAndAuthorization, async (req, res) => {
    const { userId } = req.params

    try {
        const cart = await Cart.findOne({ userId })
        res.status(200).json(cart)
    } catch (error) {
        res.status(500).json(error)
    }
})

// All carts
router.get("/", verifyTokenAndAdmin, async (req, res) => {
    try {
        const carts = await Cart.find()
        res.status(200).json(carts)
    } catch (error) {
        res.status(500).json(error)
    }
})

module.exports = router
