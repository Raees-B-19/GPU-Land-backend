require("dotenv").config();
const db = require("../config/dbMysql");
const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");

// All users
router.get("/users", (req, res) => {
  let allUsers = `Select * from users`;
  db.query(allUsers, (err, users) => {
    if (err){
      res.json({
        status : 400,
        msg : 'No users in database'
      })
    }
    res.json({
      status: 200,
      results: users,
    });
  });
});

// Single User
router.get("/users/:id", (req, res) => {
  let singleUser = `Select * from users where user_id = ${req.params.id}`;
  db.query(singleUser, (err, singleUser) => {
    if (err){
      res.json({
        status : 400,
        msg : 'No user with this id'
      })
    }
    res.json({
      status: 200,
      msg: `Single user ${singleUser[0].userFName}`,
      results: singleUser,
    });
  });
});

// Edit a user
router.put("/users/:id", bodyParser.json(), (req, res) => {
  let { userFName, userLName, email, userPassword, userImg } = req.body;
  let editUser = `Update users SET
        userFName = ?,
        userLName = ?,
        email = ?,
        userPassword = ?,
        userImg = ?
        Where user_id = ${req.params.id}
    `;
  db.query(
    editUser,
    [userFName, userLName, email, userPassword, userImg],
    (err, editedUser) => {
      if (err){
        res.json({
          status : 400,
          msg : 'Cannot edit this user'
        })
      }
      res.end(JSON.stringify(editedUser));
    }
  );
});

// Delete a user
router.delete("/users/:id", (req, res) => {
  let deleteUser = `Delete from users where user_id = ${req.params.id};
    ALTER TABLE users AUTO_INCREMENT = 1;
    `;
  db.query(deleteUser, (err) => {
    if (err){
      res.json({
        status : 400,
        msg : 'Cannot delete this user'
      })
    }
    res.json({
      status: 200,
      msg: `Your account is deleted`,
    });
  });
});

module.exports = router;
