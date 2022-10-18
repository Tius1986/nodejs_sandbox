const express = require('express')
const { 
    signup, 
    signin, 
    verifyUser,
    getMe
} = require('../controllers/userController')
const auth = require('../middleware/auth.middleware')

const router = express.Router()

router.post('/signup', signup)
router.post('/signin', signin)
router.get('/confirmation/:confirmationCode', verifyUser)
router.get('/profile', auth, getMe)

module.exports = router