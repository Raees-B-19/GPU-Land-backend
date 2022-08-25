const db = require("../config/dbMysql");
const mysql = require("mysql");
const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");

// Getting Cart
router.get('/users/:id/cart', (req, res) => {
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
// router.post('/users/:id/cart', bodyParser.json(), (req, res) => {
//     let bd = req.body
//     const cartQ = `
//             SELECT cart FROM users
//             WHERE user_id = ${req.params.id}
//         `

//     db.query(cartQ, (err, results) => {
//         if (err) throw err
//         if (results.length > 0) {
//             let cart;
//             if (results[0].cart == null) {
//                 cart = []
//             } else {
//                 cart = JSON.parse(results[0].cart)
//             }
//             let product = {
//                 "cart_id": cart.length + 1,
//                 "gpuNoA": bd.gpuNoA,
//                 "gpuNrAr": bd.gpuNrAr,
//                 "gpuGen": bd.gpuGen,
//                 "gpuChip": bd.gpuChip,
//                 "released": bd.released,
//                 "memoryGb": bd.memoryGb,
//                 "memoryType": bd.memoryType,
//                 "memoryBit": bd.memoryBit,
//                 "gpuClock": bd.gpuClock,
//                 "memoryClock": bd.memoryClock
//             }
//             cart.push(product);
//             const query = `
//                     UPDATE users
//                     SET cart = ?
//                     WHERE user_id = ${req.params.id}
//                 `

//             db.query(query, JSON.stringify(cart), (err, results) => {
//                 if (err) throw err
//                 res.json({
//                     status: 200,
//                     results: 'Product successfully added into cart'
//                 })
//             })
//         } else {
//             res.json({
//                 status: 404,
//                 results: 'There is no user with that id'
//             })
//         }
//     })
// })

router.post('/users/:id/cart', bodyParser.json(), (req, res) => {

    let cart = `SELECT cart FROM users WHERE user_id = ${req.params.id};`;
    // function
    db.query(cart, (err, results) => {
        if (err) throw err
        if (results.length > 0) {
            let cart;
            if (results[0].cart == null) {
                cart = []
            } else {
                cart = JSON.parse(results[0].cart)
            }
            let {
                gpu_id
            } = req.body;
            // mySQL query
            let product = `Select * FROM products WHERE gpu_id = ?`;
            // function
            db.query(product, gpu_id, (err, productData) => {
                if (err) throw err
                let data = {
                    cart_id: cart.length + 1,
                    productData
                }
                cart.push(data)
                console.log(cart);
                let updateCart = `UPDATE users SET cart = ? WHERE user_id = ${req.params.id}`
                db.query(updateCart, JSON.stringify(cart), (err, results) => {
                    if (err) throw err
                    res.json({
                        cart: results
                    })
                })
            })
        }
    })
});

// Delete cart
router.delete('/users/:id/cart', (req, res) => {
    const delCart = `
        SELECT cart FROM users
        WHERE user_id = ${req.params.id}
    `
    db.query(delCart, (err, results) => {
        if (err) throw err;
        if (results.length > 0) {
            const query = `
                UPDATE users
                SET cart = null
                WHERE user_id = ${req.params.id}
            `
            db.query(query, (err, results) => {
                if (err) throw err
                res.json({
                    status: 200,
                    results: `Successfully cleared the cart`
                })
            });
        } else {
            res.json({
                status: 400,
                result: `There is no user with that ID`
            });
        }
    })
})

// Delete by cart id
router.delete('/users/:id/cart/:cartId', (req, res) => {
    const delSingleCartId = `
        SELECT cart FROM users
        WHERE user_id = ${req.params.id}
    `
    db.query(delSingleCartId, (err, results) => {
        if (err) throw err;

        if (results.length > 0) {
            if (results[0].cart != null) {

                const result = JSON.parse(results[0].cart).filter((cart) => {
                    return cart.cart_id != req.params.cartId;
                })
                result.forEach((cart, i) => {
                    cart.cart_id = i + 1
                });
                const query = `
                    UPDATE users
                    SET cart = ?
                    WHERE user_id = ${req.params.id}
                `

                db.query(query, [JSON.stringify(result)], (err, results) => {
                    if (err) throw err;
                    res.json({
                        status: 200,
                        result: "Successfully deleted item from cart"
                    });
                })

            } else {
                res.json({
                    status: 400,
                    result: "This user has an empty cart"
                })
            }
        } else {
            res.json({
                status: 400,
                result: "There is no user with that id"
            });
        }
    })

})

module.exports = router