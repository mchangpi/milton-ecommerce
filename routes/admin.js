const express = require("express");
const router = express.Router();
//const path = require("path");
//const rootDir = require("../util/path");
const products = [];

router.get("/add-product", (req, resp, next) => {
  //resp.sendFile(path.join(rootDir, "views", "add-product.html"));
  resp.render("add-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    formsCSS: true,
    productCSS: true,
    activeAddProduct: true,
  });
});

router.post("/add-product", (req, resp, next) => {
  console.log("req body", req.body);
  products.push({ title: req.body.title });
  resp.redirect("/");
});

module.exports = { router, products };
