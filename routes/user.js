require("dotenv").config();
const db = require("../config/dbMysql");
const mysql = require("mysql");
const express = require("express");
const app = express();
const router = express.Router();
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

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
router.put('/users/:id',bodyParser.json(),(req,res) => {
    let {
        userFName,
        userLName,
        email,
        userPassword,
    } = req.body
    let editUser = `Update users SET
        userFName = ?,
        userLName = ?,
        email = ?,
        userPassword = ?
        Where user_id = ${req.params.id}
    `
    db.query(editUser,[
        userFName,
        userLName,
        email,
        userPassword,
    ],(err,editedUser) => {
        if(err){
            res.redirect('/error')
        }
        res.end(JSON.stringify(editedUser))
    })
})

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

module.exports = router