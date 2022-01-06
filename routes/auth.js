const router = require("express").Router()
const User = require("../models/User")
const bcrypt = require("bcryptjs")

// REGISTER
router.post("/register", async (req, res) => {
    try {
        const user = await User.create(req.body)
        res.status(200).json(user)
    } catch (error) {
        res.status(500).json(error)
    }
})

// LOGIN
router.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({email: req.body.email})
        !user && res.status(404).json('User not found')

        const validPassword = await bcrypt.compare(req.body.password, user.password)
        !validPassword && res.status(400).json("Invalid Login credentials")
        
        res.status(200).json(user)
    } catch (error) {
        res.status(500).json(error)
    }
})

module.exports = router