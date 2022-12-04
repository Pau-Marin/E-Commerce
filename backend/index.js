require("dotenv").config()
const express = require("express")
const server = express()
const mongoose = require("mongoose")
const routes = require("./routes/index.js")

const { MONGO_URL, PORT } = process.env

mongoose
    .connect(MONGO_URL)
    .then(() => {
        console.log("DB connection Successfull")
    })
    .catch((err) => {
        console.log(err)
    })

server.use(express.json())
server.use("/", routes)

server.listen(PORT || 3001, () => {
    console.log(`Backend server is running on port ${PORT ? PORT : 3001}!`)
})
