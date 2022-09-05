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
    gpuFront_Img,
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
  let newProduct = `Insert into products(gpuFront_Img,gpuNoA,gpuNrAr,gpuGen,gpuChip,released,memoryGb,memoryType,memoryBit,gpuClock,memoryClock)
                    Values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`;

  db.query(
    newProduct,
    [
      gpuFront_Img,
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
    ],
    (err, newProduct) => {
      if (err) throw err;
      res.json({
        results: newProduct,
      });
    }
  );
});

// Edit product
router.put("/products/:id", bodyParser.json(), (req, res) => {
  let {
    gpuFront_Img,
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
  let editProduct = `Update products SET
        gpuFront_Img = ? ,
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
        `;
  db.query(
    editProduct,
    [
      gpuFront_Img,
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
    ],
    (err, editedProduct) => {
      // if (err) {
      //     res.redirect("/error");
      //     console.log(err);
      // }
      if (err) throw err;
      res.json({
        results: editedProduct,
      });
    }
  );
});

router.delete("/products/:id", (req, res) => {
  let deleteProduct = `delete from products where gpu_id = ${req.params.id}; `;
  db.query(deleteProduct, (err, results) => {
    if (err) throw err;
    res.json({
      msg: "deleted",
    });
  });
});

router.post("/products/reset", bodyParser.json(), (req, res) => {
  let products = `Select * from products`;
  db.query(products, (err, products) => {
    if (err) throw err;
    console.log(products.length)
    let length = products.length
    let resetID = `ALTER TABLE products AUTO_INCREMENT = ?;`
    db.query(resetID,length,(err,results) => {
        if(err) throw err
        res.json({
            msg: `Auto increment is ${products.length}`
        })
    })
  });
});
// ========================================================= //

module.exports = router;
