const express = require("express");
const bodyParser = require("body-parser");
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");
const errorController = require("./controllers/error");
const sequelize = require("./util/database");
const session = require("express-session");
const SequelizeStore = require("connect-session-sequelize")(session.Store);
const flash = require("connect-flash");
const Product = require("./models/product");
const Member = require("./models/member");
const Cart = require("./models/cart");
const CartItem = require("./models/cart-item");
const Order = require("./models/order");
const OrderItem = require("./models/order-item");

const app = express();

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
app.use(flash());

app.set("view engine", "ejs");
app.set("views", "views");

app.use((req, resp, next) => {
  resp.locals.isAuth = req.session.isLoggedin;
  resp.locals.csrfToken = ""; //req.csrfToken();
  next();
});

app.use(async (req, resp, next) => {
  //if (req.session.member) console.log("session member ", req.session.member);
  if (!req.session.member) return next();

  const member = await Member.findByPk(req.session.member.id);
  if (!member) return next();
  req.member = member;
  next();
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use("/", errorController.get404);

Member.hasMany(Product, {
  sourceKey: "id",
  foreignKey: "memId",
  constraints: true,
  onDelete: "CASCADE",
});
/* Product.belongsTo(Member);*/

Member.hasOne(Cart);
//Cart.belongsTo(Member);

Cart.belongsToMany(Product, { through: CartItem });
//Product.belongsToMany(Cart, { through: CartItem });

Member.hasMany(Order, { sourceKey: "id", foreignKey: "memId" });
//Order.belongsTo(Member);

Order.belongsToMany(Product, { through: OrderItem });
//Product.belongsToMany(Order, { through: OrderItem });

const syncListen = async (port) => {
  await sequelize.sync();
  //.sync({ force: true }) // adds a DROP TABLE IF EXISTS
  app.listen(port, () => {
    console.log("listen on ", port);
  });
};

syncListen(process.env.PORT || 3000);
