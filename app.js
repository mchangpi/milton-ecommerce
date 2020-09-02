const express = require("express");
const bodyParser = require("body-parser");
const adminData = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const httpStatus = require("http-status-codes");
const path = require("path");
const rootDir = require("./util/path");

const app = express();
app.use("/", express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));

app.set("view engine", "pug");
app.set("views", "views");

app.use((req, resp, next) => {
  console.log("In the middleware, always runs");
  next();
});

app.use("/admin", adminData.router);
app.use(shopRoutes);

app.use("/", (req, resp, next) => {
  //resp.status(httpStatus.NOT_FOUND).send("<h1>Page Not Found</h1>");
  resp
    .status(httpStatus.NOT_FOUND)
    //.sendFile(path.join(rootDir, "views", "404.html"));
    .render("404", { pageTitle: "Page Not Found" });
});

app.listen(3000, () => {
  console.log("Node is listening on port 3000...");
});