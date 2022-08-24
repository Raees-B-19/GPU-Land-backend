require("dotenv").config();
const db = require("../config/dbMysql");
const mysql = require("mysql");
const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");

// ================== Product data ==================== //

// Get all products
router.get("/products", (req, res) => {
    let gettingProducts = `Select * from products;`;

    db.query(gettingProducts, (err, products) => {
        if (err) {
            res.redirect("/error");
            console.log(err);
        } else {
            res.json({
                status: 200,
                results: products,
            });
        }
    });
});

// Get Single Product
router.get(`/products/:id`, (req, res) => {
    let getSingleProduct = `Select * from products Where gpu_id = ${req.params.id};`;

    db.query(getSingleProduct, (err, product) => {
        if (err) {
            res.redirect("/error");
            console.log(err);
        } else if (product == "" || null) {
            res.redirect("/error");
            console.log(err);
        } else {
            res.json({
                status: 200,
                results: product,
            });
        }
    });
});

// Add product
router.post("/products", bodyParser.json(), (req, res) => {
    let {
        gpuNoA,
        gpuNrAr,
        gpuGen,
        gpuChip,
        released,
        memoryGb,
        memoryType,
        memoryBit,
        gpuClock,
        memoryClock,
    } = req.body;
    let newProduct = `Insert into products(gpuNoA,gpuNrAr,gpuGen,gpuChip,released,memoryGb,memoryType,memoryBit,gpuClock,memoryClock)
                    Values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`;

    db.query(newProduct, [
        gpuNoA,
        gpuNrAr,
        gpuGen,
        gpuChip,
        released,
        memoryGb,
        memoryType,
        memoryBit,
        gpuClock,
        memoryClock,
    ], (err, newProduct) => {
        if (err) {
            res.redirect("/error");
            console.log(err);
        }
        console.log(newProduct.affectedRows)
    });
});

// Edit product
router.put('/products/:id', bodyParser.json(), (req, res) => {
    let {
        gpuNoA,
        gpuNrAr,
        gpuGen,
        gpuChip,
        released,
        memoryGb,
        memoryType,
        memoryBit,
        gpuClock,
        memoryClock,
    } = req.body
    let editProduct = `Update products SET
        gpuNoA = ? ,
        gpuNrAr = ? ,
        gpuGen = ? ,
        gpuChip = ? ,
        released = ? ,
        memoryGb = ? ,
        memoryType = ? ,
        memoryBit = ? ,
        gpuClock = ? ,
        memoryClock = ?
        Where gpu_id = ${req.params.id}
    `
    db.query(editProduct, [
        gpuNoA,
        gpuNrAr,
        gpuGen,
        gpuChip,
        released,
        memoryGb,
        memoryType,
        memoryBit,
        gpuClock,
        memoryClock,
    ], (err, editedProduct) => {
        if (err) {
            res.redirect("/error");
            console.log(err);
        }
        res.end(JSON.stringify(editedProduct))
    })
})

router.delete('/products/:id', (req, res) => {
    let deleteProduct = `delete from products where gpu_id = ${req.params.id}`
    db.query(deleteProduct, (err) => {
        if (err) {
            res.redirect('/error')
            console.log(err)
        }
    })
})
// ========================================================= //

module.exports = router