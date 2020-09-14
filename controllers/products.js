const Product = require("../models/product");

const getAddProduct = (req, resp, next) => {
  //resp.sendFile(path.join(rootDir, "views", "add-product.html"));
  resp.render("add-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    formsCSS: true,
    productCSS: true,
    activeAddProduct: true,
  });
};

const postAddProduct = (req, resp, next) => {
  console.log("req body", req.body);
  const product = new Product(req.body.title);
  product.save();
  // products.push({ title: req.body.title });
  resp.redirect("/");
};

const getProducts = (req, resp, next) => {
  Product.fetchAll((allProducts) => {
    resp.render("shop", {
      pageTitle: "Shop",
      path: "/",
      prods: allProducts,
      hasProducts: allProducts.length > 0,
      productCSS: true,
      activeShop: true,
    });
  });
};

module.exports = { getAddProduct, postAddProduct, getProducts };
