const express = require("express");
const bodyParser = require("body-parser");
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, resp, next) => {
  console.log("In the middleware, always runs");
  next();
});

app.use(shopRoutes);
app.use(adminRoutes);

app.listen(3000, () => {
  console.log("Node is listening on port 3000...");
});
