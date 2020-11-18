//const mysql = require("mysql2");
const Sequelize = require("sequelize");
require("dotenv").config();

const [host, user, password, dbname, port] = [
  "remotemysql.com",
  "4tTI663KOk",
  process.env.DB_PASS,
  "4tTI663KOk",
  3306,
];

const sequelize = new Sequelize(dbname, user, password, {
  host,
  dialect: "mysql",
  port,
  logging: false,
});

module.exports = sequelize;
