const Sequelize = require("sequelize");
const sequelize = require("../util/database");

const OrderSub = sequelize.define("orderSub", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  quantity: Sequelize.INTEGER,
});

module.exports = OrderSub;
