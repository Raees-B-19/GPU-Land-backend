require("dotenv").config();
const mysql = require("mysql");

const con = mysql.createConnection({
  host: process.env.dbHost,
  user: process.env.dbUser,
  password: process.env.dbPassword,
  database: process.env.dbDatabasename,
  port: process.env.dbPort,
  multipleStatements: true,
});

con.connect((err) => {
  if (err){
    res.json({
      status : 400,
      msg : 'Any err occurred',
      err : err
    })
  }
  else {
      console.log("Your Database is running on render");
    }
  }
);

module.exports = con;
