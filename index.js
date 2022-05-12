const express = require('express')
const router = require('./src/routes')
require('dotenv').config()
const app = express()
const cors = require('cors')
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

app.use('/api/v1', router)
app.use('/uploads', express.static('uploads'))

app.listen(port, ()=> console.log(`Listening on port ${port}!`))