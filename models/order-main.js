const Sequelize = require("sequelize");
const sequelize = require("../util/database");

const Order = sequelize.define("orderMain", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  total: {
    type: Sequelize.DOUBLE,
    allowNull: false,
  },
});

module.exports = Order;
