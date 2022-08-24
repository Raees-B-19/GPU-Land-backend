const db = require("../config/dbMysql");
const mysql = require("mysql");
const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");

// Getting Cart
router.get('/users/:id/cart',bodyParser.json(),(req,res) => {
    let userCart = `Select cart from users where user_id = ${req.params.id}`
    db.query(userCart,(err,cart) => {
        if(err){
            res.redirect('/error')
            console.log(err)
        }else{
            res.json({
                status : 200,
                results : cart
            })
        }
    })
})

// Pushing in product
router.post('/users/:id/cart',bodyParser.json(),(req,res) => {
    
})