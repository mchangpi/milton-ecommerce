const express = require("express");
const bodyParser = require("body-parser");
const adminData = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const errorController = require("./controllers/error");

const app = express();
app.use("/", express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));

app.set("view engine", "ejs");
app.set("views", "views");

app.use((req, resp, next) => {
  console.log("In the middleware, always runs");
  next();
});

app.use("/", shopRoutes);
app.use("/admin", adminData.router);

app.use("/", errorController.get404);

app.listen(3000, () => {
  console.log("Node is listening on port 3000...");
});
