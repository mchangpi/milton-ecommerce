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
  Product.create({
    title: req.body.title,
    price: req.body.price,
    imageUrl: req.body.imageUrl,
    description: req.body.description,
  })
    .then((result) => console.log(result[0]))
    .catch((e) => console.trace(e));
};

const getEditProduct = (req, resp, next) => {
  console.log(" req.params ", req.params, " req.query ", req.query);
  const prodId = req.params.id;
  const editMode = req.query.edit;
  if (!editMode) {
    return resp.redirect("/");
  }
  Product.findByPk(prodId)
    .then((product) => {
      if (!product) {
        return resp.redirect("/");
      }
      resp.render("admin/edit-product", {
        pageTitle: "Edit Product",
        path: "/admin/edit-product",
        editing: editMode,
        product,
      });
    })
    .catch((e) => console.trace(e));
};

const postEditProduct = (req, resp, next) => {
  Product.findByPk(req.body.productId)
    .then((p) => {
      p.title = req.body.title;
      p.imageUrl = req.body.imageUrl;
      p.description = req.body.description;
      p.price = req.body.price;
      return p.save();
    })
    .then(() => resp.redirect("/admin/products"))
    .catch((e) => console.trace(e));
};

const postDeleteProduct = (req, resp, next) => {
  const prodId = req.body.productId;
  Product.deleteById(prodId);
  resp.redirect("/admin/products");
};

const getAdminProducts = (req, resp, next) => {
  Product.findAll()
    .then((products) => {
      resp.render("admin/products", {
        pageTitle: "Admin products",
        path: "/admin/prodcuts",
        prods: products,
      });
    })
    .catch((e) => console.trace(e));
};

module.exports = {
  getAdminProducts,
  getAddProduct,
  postAddProduct,
  getEditProduct,
  postEditProduct,
  postDeleteProduct,
};
