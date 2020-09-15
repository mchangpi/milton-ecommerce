const Product = require("../models/product");

const getAddProduct = (req, resp, next) => {
  //resp.sendFile(path.join(rootDir, "views", "add-product.html"));
  resp.render("admin/add-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    formsCSS: true,
    productCSS: true,
    activeAddProduct: true,
  });
};

const postAddProduct = (req, resp, next) => {
  console.log("req body", req.body);
  const product = new Product(
    req.body.title,
    req.body.imageURL,
    req.body.description,
    req.body.price
  );
  product.save();
  // products.push({ title: req.body.title });
  resp.redirect("/");
};

const getAdminProducts = (req, resp, next) => {
  Product.fetchAll((products) => {
    resp.render("admin/products", {
      pageTitle: "Admin products",
      path: "/admin/prodcuts",
      prods: products,
    });
  });
};

module.exports = { getAddProduct, postAddProduct, getAdminProducts };
