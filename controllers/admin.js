const Product = require("../models/product");

const getAddProduct = (req, resp, next) => {
  resp.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
  });
};

const postAddProduct = (req, resp, next) => {
  console.log("req body", req.body);
  const product = new Product(
    null,
    req.body.title,
    req.body.imageUrl,
    req.body.description,
    req.body.price
  );
  product
    .save()
    .then(() => resp.redirect("/"))
    .catch((e) => console.trace(e));
  // products.push({ title: req.body.title });
  resp.redirect("/");
};

const getEditProduct = (req, resp, next) => {
  console.log(" req.params ", req.params, " req.query ", req.query);
  const prodId = req.params.id;
  const editMode = req.query.edit;
  if (!editMode) {
    console.log(" Not edit mode ");
    return resp.redirect("/");
  }
  Product.findById(prodId, (product) => {
    if (!product) {
      console.log("Not find product id ", prodId);
      return resp.redirect("/");
    }
    resp.render("admin/edit-product", {
      pageTitle: "Edit Product",
      path: "/admin/edit-product",
      editing: editMode,
      product: product,
    });
  });
};

const postEditProduct = (req, resp, next) => {
  const updatedProduct = new Product(
    req.body.productId,
    req.body.title,
    req.body.imageUrl,
    req.body.description,
    req.body.price
  );
  updatedProduct.save();
  resp.redirect("/admin/products");
};

const postDeleteProduct = (req, resp, next) => {
  const prodId = req.body.productId;
  Product.deleteById(prodId);
  resp.redirect("/admin/products");
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

module.exports = {
  getAdminProducts,
  getAddProduct,
  postAddProduct,
  getEditProduct,
  postEditProduct,
  postDeleteProduct,
};
