const jwt = require('jsonwebtoken')
const User = require('../models/User')

// Token format
// Authorization: Bearer <token>
const auth = async (req, res, next) => {
    
    let token

    if (req.headers['authorization'] 
    && req.headers['authorization'].startsWith('Bearer')) {

        try {

            token = req.headers['authorization'].split(' ')[1]

            const decoded = jwt.verify(token, process.env.JWT_SECRET)

            req.user = await User.findById(decoded._id).select('-password')

            next()

        } catch (err) {
            res.status(401)
            res.json({ message: err.message })
        }

        if(!token) {
            res.status(401)
            throw new Error('Not authorized, no token')
        }
    }
}

module.exports = auth