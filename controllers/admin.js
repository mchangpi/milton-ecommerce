const Product = require("../models/product");
const httpStatus = require("http-status-codes");
const { validationResult } = require("express-validator");
const passError = require("../util/passerror");
//const fileHelper = require("../util/file");

const getProducts = async (req, resp, next) => {
  const products = await Product.findAll();
  //console.log("Products ", products);
  resp.render("admin/products", {
    pageTitle: "Admin products",
    path: "/admin/prodcuts",
    prods: products,
  });
};

const getAddProduct = (req, resp, next) => {
  resp.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
    validateErrors: [],
  });
};

const postAddProduct = async (req, resp, next) => {
  const { title, price, imageUrl, description } = req.body;
  //console.log("req body ", req.body);
  const validateErrors = validationResult(req);

  if (!validateErrors.isEmpty()) {
    return resp
      .status(httpStatus.UNPROCESSABLE_ENTITY)
      .render("admin/edit-product", {
        pageTitle: "Add Product",
        path: "/admin/add-product",
        editing: false,
        product: { title, price, description },
        errorMessage:
          validateErrors.array().length > 0
            ? validateErrors.array()[0].msg
            : "Attached file is not an image of format: jpeg/jpg/png",
        validateErrors:
          validateErrors.array().length > 0 ? validateErrors.array() : [],
      });
  }

  await req.user.createProduct({
    title,
    price,
    imageUrl,
    description,
  });
  //console.log("Create product ", result);
  resp.redirect("/admin/products");
};

const getEditProduct = async (req, resp, next) => {
  console.log(" req.params ", req.params, " req.query ", req.query);
  const prodId = req.params.id;
  const editMode = req.query.edit;
  if (!editMode) {
    return resp.redirect("/");
  }
  const product = await Product.findByPk(prodId);
  //throw new Error("Dummy");
  if (!product) {
    return resp.redirect("/");
  }
  resp.render("admin/edit-product", {
    pageTitle: "Edit Product",
    path: "/admin/edit-product",
    editing: editMode,
    product,
    validateErrors: [],
  });
};

const postEditProduct = async (req, resp, next) => {
  const { productId, title, price, imageUrl, description } = req.body;
  //const image = req.file;
  const validateErrors = validationResult(req);
  if (!validateErrors.isEmpty()) {
    return resp
      .status(httpStatus.UNPROCESSABLE_ENTITY)
      .render("admin/edit-product", {
        pageTitle: "Edit Product",
        path: "/admin/edit-product",
        editing: true,
        product: {
          id: productId,
          title,
          price,
          description,
        },
        errorMessage: validateErrors.array()[0].msg,
        validateErrors: validateErrors.array(),
      });
  }

  const prodId = req.body.productId;
  //console.log("id ", prodId);
  const product = await Product.findByPk(prodId);
  if (product.userId.toString() !== req.user.id.toString()) {
    return resp.redirect("/");
  }
  product.title = title;
  product.price = price;
  product.imageUrl = imageUrl;
  product.description = description;
  await product.save();
  resp.redirect("/admin/products");
};

const deleteProduct = async (req, resp, next) => {
  const prodId = req.params.productId;
  const product = await Product.findOne({
    where: { id: prodId, userId: req.user.id },
  });
  if (product) {
    await product.destroy();
    resp.status(200).json({ message: "Success" });
  } else {
    return passError(new Error("Not Authorized"), next);
  }
};

module.exports = {
  getProducts,
  getAddProduct,
  postAddProduct,
  getEditProduct,
  postEditProduct,
  deleteProduct,
};
