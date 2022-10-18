const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const nodemailer = require('../config/nodemailer.config')

const signup = async (req, res) => {

    const { id, username, email, password } = req.body

    if (!username || !email || !password) {
        return res.json({ 
            message: 'Please add all fields'
        })
    }

    try {

        const emailExists = await User.findOne({ email })
        const usernameExists = await User.findOne({ username })

        if (emailExists) {
            return res.status(400).json({ 
                message: 'Email already registered' 
            })
        }

        if (usernameExists) {
            return res.status(400).json({ 
                message: 'Username already taken' 
            })
        }

        // hash password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        // Generate jwt token for email confirmation
        const token = jwt.sign({id}, process.env.JWT_SECRET)

        const user = await User.create({
            username,
            email,
            password: hashedPassword,
            confirmationCode: token
        })

        // Send email to new registered user with confirmation code
        nodemailer.sendConfirmationEmail(
            user.username,
            user.email,
            user.confirmationCode
        )

        return res.status(201).json({ 
            message: 'You are successfully registered, please check your email' 
        })

    } catch (err) {
        console.log({ message: err.message })
    }
}

const signin = async (req, res) => {

    const { id, email, password } = req.body

    try {

        const user = await User.findOne({ email })

        if(!user) {
            return res.json({ 
                message: 'No email registered' 
            })
        }

        if(user.status !== 'Active') {
            return res.status(401).json({
                message: 'Pending account, Please verify your email'
            })
        }

        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: 86400 })

        if(user && (await bcrypt.compare(password, user.password))) {
            res.json({
                _id: user.id,
                username: user.username,
                email: user.email,
                accessToken: token
            })

        } else {
            return res.json({ message: 'Wrong password' })
        }

    } catch (err) {
        console.log({ message: err.message })
    }
}


const verifyUser = async (req, res) => {

    try {

        const user = await User.findOne({
            confirmationCode: req.params.confirmationCode
        })

        if (!user) {
            return res.json({ message: 'Verification failed' })
        }

        user.status = 'Active'

        await user.save()

        res.json({ message: 'Your email is now verified' })

    } catch (err) {
        console.log({ message: err.message })
    }
}

const getMe = async (req, res) => {
    res.status(200).json(req.user)
}

module.exports = {
    signup,
    signin,
    verifyUser,
    getMe
}