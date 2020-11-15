//const mysql = require("mysql2");
const Sequelize = require("sequelize");
require("dotenv").config();

const [host, user, password, dbname, port] = [
  "db4free.net",
  "mchangpi",
  process.env.DB_PASS,
  "mariadb4free",
  3306,
];

const sequelize = new Sequelize(dbname, user, password, {
  host: host,
  dialect: "mysql",
  port: port,
});

module.exports = sequelize;
