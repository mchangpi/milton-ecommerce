const mysql = require("mysql2");
require("dotenv").config();

const pool = mysql.createPool({
  host: "sql12.freemysqlhosting.net",
  user: "sql12366529",
  database: "sql12366529",
  password: process.env.DB_PASS,
  port: 3306,
});

module.exports = pool.promise();
