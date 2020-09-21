const express = require("express");
const bodyParser = require("body-parser");
const adminData = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const errorController = require("./controllers/error");
const sequelize = require("./util/database");
const Product = require("./models/product");
const User = require("./models/user");
const Cart = require("./models/cart");
const CartItem = require("./models/cart-item");
const Order = require("./models/order");
const OrderItem = require("./models/order-item");

const app = express();
app.use("/", express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));

app.set("view engine", "ejs");
app.set("views", "views");

app.use((req, resp, next) => {
  User.findByPk(1)
    .then((user) => {
      //console.log("Only runs after Node initialization, user ", user);
      req.user = user;
      next();
    })
    .catch((e) => console.trace(e));
});

app.use("/", shopRoutes);
app.use("/admin", adminData.router);

app.use("/", errorController.get404);

// constraints: Should on update and on delete constraints be enabled on the foreign key.
// onDelete: SET NULL if foreignKey allows nulls, CASCADE if otherwise
User.hasMany(Product, { constraints: true, onDelete: "CASCADE" });
//Product.belongsTo(User, { constraints: true, onDelete: "CASCADE" });

User.hasOne(Cart);
//Cart.belongsTo(User);

Cart.belongsToMany(Product, { through: CartItem });
//Product.belongsToMany(Cart, { through: CartItem });

User.hasMany(Order);
//Order.belongsTo(User);

Order.belongsToMany(Product, { through: OrderItem });
//Product.belongsToMany(Order, { through: OrderItem });

sequelize
  .sync({ force: true }) // adds a DROP TABLE IF EXISTS
  //.sync()
  .then((result) => {
    return User.findByPk(1);
  })
  .then((user) => {
    if (user) return Promise.resolve(user);
    else return User.create({ name: "Milton", email: "milton@gmail.com" });
  })
  .then((user) => {
    return user.createCart();
  })
  .then((cart) => {
    app.listen(3000, () => {});
  })
  .catch();
