require('dotenv').config()
const db = require('./config/dbMysql')
const mysql = require('mysql')
const express = require('express')
const app = express()
const router = express.Router()
const bodyParser = require('body-parser')
const port = parseInt(process.env.PORT) || 4000

app.use(bodyParser.urlencoded({
    extended : true
}))
app.use(express.json(),router,bodyParser)

app.listen(port,(err) => {
    if(err) throw err
    console.log(`Sever is running on http://localhost:${port}`)
})

router.get('/',(req,res) => {
    res.sendFile('./index.html', {root : __dirname})
})

router.get('/products',bodyParser.json(),(req,res) => {
    let gettingProducts = `Select * from products;`
    db.query(gettingProducts,(err,products) => {
        if(err){
            res.send(404)
            console.log(err)
        }else{
            res.json({
                status : 200,
                results : products
            })
        }
    })
})

router.get(`/products/:id`,bodyParser.json(),(req,res) => {
    let getSingleProduct = `Select * from products Where gpu_id = ${req.params.id}`
    db.query(getSingleProduct,(err,product) => {
        if(err){
            res.send(404)
            console.log(err)
        }else if(product == '' || null){
            res.send(404)
            console.log(err)
        }else{
            res.json({
                status : 200,
                results : product
            })
        }
    })
})