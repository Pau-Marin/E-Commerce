const jwt = require("jsonwebtoken")

const { JWT_SEC } = require("dotenv")

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.token

    if (authHeader) {
        const token = authHeader.split(" ")[1]
        jwt.verify(token, JWT_SEC, (err, user) => {
            if (err) res.status(403).json("Token is not valid!")
            req.user = user
            next()
        })
    } else {
        return res.status(401).json("You are not authenticated")
    }
}

const verifyTokenAndAuthorization = (req, res, next) => {
    verifyToken(req, res, () => {
        const { id } = req.params
        const { isAdmin } = req.user
        if (req.user.id === id || isAdmin) {
            next()
        } else {
            res.status(403).json("You are not allowed to do that!")
        }
    })
}

const verifyTokenAndAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
        const { isAdmin } = req.user
        if (isAdmin) {
            next()
        } else {
            res.status(403).json("You are not allowed to do that!")
        }
    })
}

module.exports = {
    verifyToken,
    verifyTokenAndAuthorization,
    verifyTokenAndAdmin,
}
