require("dotenv").config();
const db = require("../config/dbMysql");
const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");

// ================== Product data ==================== //

// Get all products
router.get("/products", (req, res) => {
  let gettingProducts = `Select * from products;`;

  db.query(gettingProducts, (err, products) => {
    if (err) {
      res.json({
        status: 400,
        msg: "No products found",
      });
    }

    res.json({
      status: 200,
      results: products,
    });
  });
});

// Get Single Product
router.get(`/products/:id`, (req, res) => {
  let getSingleProduct = `Select * from products Where gpu_id = ${req.params.id};`;

  db.query(getSingleProduct, (err, product) => {
    if (err) {
      res.json({
        status: 400,
        msg: "Cannot find this product",
      });
    }
    if (product == "" || null) {
      console.log(`No products in stock`);
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
    gpuTop,
    gpuBack,
    gpuBottom,
    gpuIo,
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
    price,
  } = req.body;
  let newProduct = `Insert into products(gpuFront_Img, gpuTop, gpuBack, gpuBottom, gpuIo, gpuNoA, gpuNrAr, gpuGen, gpuChip, released, memoryGb, memoryType, memoryBit,gpuClock, memoryClock, price)
                    Values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`;

  db.query(
    newProduct,
    [
      gpuFront_Img,
      gpuTop,
      gpuBack,
      gpuBottom,
      gpuIo,
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
      price,
    ],
    (err, newProduct) => {
      if (err) {
        res.json({
          status: 400,
          msg: "Cannot add Product",
        });
      }
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
    gpuTop,
    gpuBack,
    gpuBottom,
    gpuIo,
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
    price,
  } = req.body;
  let editProduct = `Update products SET
        gpuFront_Img = ? ,
        gpuTop = ? ,
        gpuBack = ? ,
        gpuBottom = ? ,
        gpuIo = ? ,
        gpuNoA = ? ,
        gpuNrAr = ? ,
        gpuGen = ? ,
        gpuChip = ? ,
        released = ? ,
        memoryGb = ? ,
        memoryType = ? ,
        memoryBit = ? ,
        gpuClock = ? ,
        memoryClock = ?,
        price = ?
        Where gpu_id = ${req.params.id}
        `;
  db.query(
    editProduct,
    [
      gpuFront_Img,
      gpuTop,
      gpuBack,
      gpuBottom,
      gpuIo,
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
      price,
    ],
    (err, editedProduct) => {
      if (err){
        res.json({
          status : 400,
          msg : 'Cannot edit this product',
        })
      };
      res.json({
        results: editedProduct,
      });
    }
  );
});

router.delete("/products/:id", (req, res) => {
  let deleteProduct = `delete from products where gpu_id = ${req.params.id}; `;
  db.query(deleteProduct, (err, results) => {
    if (err){
      res.json({
        status : 400,
        msg : 'Cannot delete this product'
      })
    };
    res.json({
      msg: "deleted",
    });
  });
});

router.post("/products/reset", bodyParser.json(), (req, res) => {
  let products = `Select * from products`;
  db.query(products, (err, products) => {
    if (err){
      res.json({
        status : 400,
        msg : 'Cannot reset products'
      })
    }
    console.log(products.length);
    let length = products.length;
    let resetID = `ALTER TABLE products AUTO_INCREMENT = ?;`;
    db.query(resetID, length, (err, results) => {
      if (err){
        res.json({
          status : 400,
          msg : 'Cannot find this product'
        })
      }
      res.json({
        msg: `Auto increment is ${products.length}`,
      });
    });
  });
});
// ========================================================= //

module.exports = router;
