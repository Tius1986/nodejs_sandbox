if(process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express')
const db = require('./config/db.config')
const cors = require('cors')
const userRoutes = require('./routes/userRoutes')

const PORT = process.env.PORT || 3000

db()

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())

app.use('/api/auth', userRoutes)

app.listen(PORT, (err) => {
    if(err) {
        console.log(err)
    }
    console.log(`Server running on http://localhost:${PORT}`)
})