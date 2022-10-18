const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Please enter a username']   
    },
    email: {
        type: String,
        required: [true, 'Please enter your email'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Please add a new password']
    },
    status: {
        type: String,
        enum: ['Active', 'Pending'],
        default: 'Pending'
    },
    confirmationCode: {
        type: String,
        unique: true
    }
})

module.exports = mongoose.model('user', userSchema)