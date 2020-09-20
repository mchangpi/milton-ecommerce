const mysql = require("mysql2");
const Sequelize = require("sequelize");
require("dotenv").config();

const [host, user, password, port] = [
  "sql12.freemysqlhosting.net",
  "sql12366529",
  process.env.DB_PASS,
  3306,
];

const sequelize = new Sequelize(user, user, password, {
  host: host,
  dialect: "mysql",
  port: port,
});

module.exports = sequelize;
