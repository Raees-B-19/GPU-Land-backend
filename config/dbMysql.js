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

function restart() {
  con.connect((err) => {
    if (err) {
      if (err.code === "PROTOCOL_CONNECTION_LOST") {
        setTimeout(restart(), 2000);
      } else {
        console.log("Your Database is running");
      }
    }
  });
}

restart();

module.exports = restart();
