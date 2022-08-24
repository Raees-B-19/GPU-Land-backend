require("dotenv").config();
const db = require("./config/dbMysql");
const mysql = require("mysql");
const express = require("express");
const app = express();
const router = express.Router();
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const port = parseInt(process.env.PORT) || 4000;

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "*");
    res.setHeader("Access-Control-Allow-Methods", "*");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    next();
});

app.use(
    express.json(),
    cors(),
    router,
    express.urlencoded({
        extended: true,
    })
);

app.listen(port, (err) => {
    if (err) throw err;
    console.log(`Sever is running on http://localhost:${port}`);
});

router.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "./views", "/index.html"));
});

router.get("/error", (req, res) => {
    res.sendFile(path.join(__dirname, "./views", "/404.html"));
});

router.get("/register", (req, res) => {
    res.sendFile(path.join(__dirname, "./views", "/register.html"));
});

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

// Register
router.post('/register', bodyParser.json(), (req, res) => {
    let checkEmail = {
        email: req.body.email
    }
    let checkEmail1 = `Select * from users where email = ?`
    db.query(checkEmail1, checkEmail.email, async (err, emails) => {
        if (err) throw err
        if (emails.length > 0) {
            res.json({
                status: 400,
                msg: 'This email already exist'
            })
        } else {
            let {
                userFName,
                userLName,
                email,
                userPassword,
            } = req.body
            let hash = await bcrypt.hash(userPassword, 10)
            let register = `Insert into users(userFName,userLName,email,userPassword)
                            Values(?,?,?,?)`

            db.query(register, [
                userFName,
                userLName,
                email,
                hash,
            ], (err, registered) => {
                if (err) throw err
                res.json({
                    status: 200,
                    msg: 'You are successfully registered'
                })
            })
        }
    })
})

// Login
router.get("/login", bodyParser.json(), (req, res) => {
    let {
        email,
        userPassword
    } = req.body
    let login = `Select * from users where email = ?`
    db.query(login,email,(err, results) => {
        if (err) throw err
        if (results[0].email == 0) {
            res.json({
                status: 400,
                msg: `Email doesn't exist`
            })
        }else{
            let match = bcrypt.compare(userPassword, results[0].userPassword)
            if (!match) {
                res.json({
                    status: 400,
                    msg: `The password does not match`
                })
            }else{
                let user = {
                    user_id: results[0].user_id,
                    userFName: results[0].userFName,
                    userLName: results[0].userLName,
                    email: results[0].email,
                    userPassword: results[0].userPassword,
                    userRole: results[0].userRole,
                }
                jwt.sign(user,process.env.jwtsecret,(err,token) => {
                    if(err) throw err
                    console.log(token)
                })
                // console.log(user)
            }
        }
    })
})

// All users
router.get('/users',(req,res) => {
    let allUsers = `Select * from users`
    db.query(allUsers,(err,users) => {
        if(err){
            res.redirect('/error')
            console.log(err)
        }else{
            res.json({
                status: 200,
                results : users
            })
        }
    })
})

// Single User
router.get('/users/:id',(req,res) => {
    let singleUser = `Select * from users where user_id = ${req.params.id}`
    db.query(singleUser,(err,singleUser) => {
        if(err){
            res.redirect('error')
        }else{
            res.json({
                status : 200,
                results : singleUser
            })
        }
    })
})

// Edit a user
router

// Delete a user
router.delete('/users/:id',(req,res) => {
    let deleteUser = `Delete from users where user_id = ${req.params.id}`
    db.query(deleteUser,(err,) => {
        if(err){
            res.redirect('/error')
            console.log(err)
        }else{
            res.json({
                status: 200,
                msg : `Your account is deleted`
            })
        }
    })
})