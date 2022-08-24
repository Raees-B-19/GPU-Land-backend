const db = require("../config/dbMysql");
const mysql = require("mysql");
const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");

// Getting Cart
router.get('/users/:id/cart', bodyParser.json(), (req, res) => {
    let gettingCart = `Select cart from users where user_id = ${req.params.id}`
    db.query(gettingCart, (err, cart) => {
        if (err) {
            res.redirect('/error')
            console.log(err)
        } else {
            res.json({
                status: 200,
                results: JSON.parse(cart[0].cart)
            })
        }
    })
})

// Pushing in product
router.post('/users/:id/cart', bodyParser.json(), (req, res) => {
    let cart = `select cart from users where user_id = ${req.params.id};`
    db.query(cart, (err, results) => {
        if (err) throw err
        if (results.length > 0) {
            let cart
        }
        if (results[0].length === null) {
            cart = []
        } else {
            cart = JSON.parse(results[0].cart)
        }
        let {
            gpu_id
        } = req.body
        let product = `Select * from products where gpu_id = ?`;

        db.query(product, gpu_id, (err, productData) => {
            if (err) throw err
            cart.push(productData)
            console.log(cart);
            let updateCart = `UPDATE users SET cart = ? WHERE user_id = ${req.params.id}`
            db.query(updateCart, JSON.stringify(cart), (err, results) => {
                if (err) throw err
                res.json({
                    cart: results
                })
            })
        })
    })

})



module.exports = router