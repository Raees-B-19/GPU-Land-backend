require('dotenv').config()
const db = require('./config/dbMysql')
const mysql = require('mysql')
const express = require('express')
const app = express()
const route = express.Router()
const port = parseInt(process.env.PORT) || 4000

app.use(express.json(),route)

app.listen(port,(err) => {
    if(err) throw err
    console.log(`Sever is running on http://localhost:${port}`)
})

route.get('/',(req,res) => {
    res.sendFile('./index.html', {root : __dirname})
})

