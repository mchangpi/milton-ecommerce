const express = require("express");
const bodyParser = require("body-parser");
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const httpStatus = require("http-status-codes");

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, resp, next) => {
  console.log("In the middleware, always runs");
  next();
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use("/", (req, resp, next) => {
  resp.status(httpStatus.NOT_FOUND).send("<h1>Page Not Found</h1>");
});

app.listen(3000, () => {
  console.log("Node is listening on port 3000...");
});
