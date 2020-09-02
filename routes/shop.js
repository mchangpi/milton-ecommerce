const express = require("express");
const router = express.Router();
const path = require("path");
const adminData = require("./admin");
const rootDir = require("../util/path");

router.get("/", (req, resp, next) => {
  console.log("products ", adminData.products);
  //resp.sendFile(path.join(rootDir, "views", "shop.html"));
  resp.render("shop", {
    pageTitle: "Shop",
    path: "/",
    prods: adminData.products,
  });
});

module.exports = router;
