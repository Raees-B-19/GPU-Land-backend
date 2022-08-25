require("dotenv").config();
const db = require("../config/dbMysql");
const mysql = require("mysql");
const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

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
                jwt.sign(user,process.env.jwtsecret,{expiresIn : "365d"},(err,token) => {
                    if(err) throw err
                    console.log(token)
                })
                // console.log(user)
            }
        }
    })
})

module.exports = router;