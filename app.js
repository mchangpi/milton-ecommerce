const express = require("express");
const bodyParser = require("body-parser");
const adminData = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const errorController = require("./controllers/error");
const sequelize = require("./util/database");
const Product = require("./models/product");
const User = require("./models/user");

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
Product.belongsTo(User, { constraints: true, onDelete: "CASCADE" });
User.hasMany(Product);

sequelize
  .sync(/*{ force: true }*/) // adds a DROP TABLE IF EXISTS
  .then((result) => {
    return User.findByPk(1);
  })
  .then((user) => {
    if (user) {
      return Promise.resolve(user);
    } else {
      return User.create({ name: "Milton", email: "milton@gmail.com" });
    }
  })
  .then((user) => {
    //console.log("Has user ", user);
    app.listen(3000, () => {
      console.log("Node is listening on port 3000...");
    });
  })
  .catch();
