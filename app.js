const express = require("express");
const bodyParser = require("body-parser");
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");
const errorController = require("./controllers/error");
const sequelize = require("./util/database");
const session = require("express-session");
const SequelizeStore = require("connect-session-sequelize")(session.Store);
const csrf = require("csurf");
const flash = require("connect-flash");
const Product = require("./models/product");
const User = require("./models/user");
const Cart = require("./models/cart");
const CartItem = require("./models/cart-item");
const Order = require("./models/order");
const OrderItem = require("./models/order-item");

const app = express();
const csrfProtection = csrf();

app.use("/", express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: new SequelizeStore({
      db: sequelize,
      checkExpirationInterval: 15 * 60 * 1000,
      expiration: 60 * 60 * 1000,
    }),
  })
);
//app.use(csrfProtection);
app.use(flash());

app.set("view engine", "ejs");
app.set("views", "views");

app.use((req, resp, next) => {
  resp.locals.isAuth = req.session.isLoggedin;
  resp.locals.csrfToken = ""; //req.csrfToken();
  next();
});

app.use((req, resp, next) => {
  if (req.session.user) console.log("session user ", req.session.user);
  if (!req.session.user) {
    return next();
  }

  User.findByPk(req.session.user.id)
    .then((user) => {
      if (!user) return next();
      req.user = user;
      next();
    })
    .catch((e) => console.log(e));
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use("/", errorController.get404);

// constraints: Should on update and on delete constraints be enabled on the foreign key.
// onDelete: SET NULL if foreignKey allows nulls, CASCADE if otherwise
User.hasMany(Product, {
  sourceKey: "id",
  foreignKey: "userId",
  constraints: true,
  onDelete: "CASCADE",
});
/*
Product.belongsTo(User, {
  constraints: true,
  onDelete: "CASCADE",
});*/

User.hasOne(Cart);
//Cart.belongsTo(User);

Cart.belongsToMany(Product, { through: CartItem });
//Product.belongsToMany(Cart, { through: CartItem });

User.hasMany(Order);
//Order.belongsTo(User);

Order.belongsToMany(Product, { through: OrderItem });
//Product.belongsToMany(Order, { through: OrderItem });

sequelize
  //.sync({ force: true }) // adds a DROP TABLE IF EXISTS
  .sync() /*
  .then((result) => {
    return User.findByPk(1);
  })
  .then((user) => {
    if (user) return Promise.resolve(user);
    else return User.create({ email: "milton@gmail.com", password: "12345" });
  })
  .then((user) => {
    return user.createCart();
  })*/
  .then((cart) => {
    app.listen(3000, () => {});
  })
  .catch();
