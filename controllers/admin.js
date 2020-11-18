const Product = require("../models/product");
const httpStatus = require("http-status-codes");
const { validationResult } = require("express-validator");
const passError = require("../util/passerror");
//const fileHelper = require("../util/file");

const getProducts = (req, resp, next) => {
  Product.findAll()
    //.select("title price -_id")
    //.populate("userId", "name")
    .then((products) => {
      //console.log("Products ", products);
      resp.render("admin/products", {
        pageTitle: "Admin products",
        path: "/admin/prodcuts",
        prods: products,
      });
    })
    .catch((e) => passError(e, next));
};

const getAddProduct = (req, resp, next) => {
  resp.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
    validateErrors: [],
  });
};

const postAddProduct = (req, resp, next) => {
  const { title, price, description } = req.body;
  console.log("req body ", req.body);
  const validateErrors = validationResult(req);

  if (!validateErrors.isEmpty() /*|| !req.file*/) {
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

  req.user
    .createProduct({
      title: title,
      price: price,
      imageUrl: req.body.imageUrl,
      description: description,
    })
    .then((result) => {
      //console.log("Create product ", result);
      resp.redirect("/admin/products");
    })
    .catch((e) => passError(e, next));
};

const getEditProduct = (req, resp, next) => {
  console.log(" req.params ", req.params, " req.query ", req.query);
  //const prodId = mongoose.Types.ObjectId(req.params.id);
  const prodId = req.params.id;
  const editMode = req.query.edit;
  if (!editMode) {
    return resp.redirect("/");
  }
  Product.findByPk(prodId)
    .then((product) => {
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
    })
    .catch((e) => passError(e, next));
};

const postEditProduct = (req, resp, next) => {
  const { productId, title, price, description } = req.body;
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

  //const prodId = mongoose.Types.ObjectId(req.body.productId);
  const prodId = req.body.productId;
  //console.log("id ", prodId);
  Product.findByPk(prodId)
    .then((p) => {
      if (p.userId.toString() !== req.user.id.toString()) {
        return resp.redirect("/");
      }
      p.title = title;
      p.price = price;
      {
        //fileHelper.deleteFile(product.imageUrl);
        p.imageUrl = req.body.imageUrl;
      }
      p.description = description;
      return p
        .save()
        .then((afterProductSave) => resp.redirect("/admin/products"))
        .catch((e) => passError(e, next));
    })
    .catch((e) => passError(e, next));
};

const deleteProduct = (req, resp, next) => {
  //const prodId = mongoose.Types.ObjectId(req.params.productId);
  const prodId = req.params.productId;
  Product.findByPk(prodId)
    .then((product) => {
      if (!product) {
        return passError(new Error("No Product"), next);
      }
      //fileHelper.deleteFile(product.imageUrl);
      return Product.findOne({ where: { id: prodId, userId: req.user.id } });
    })
    .then((product) => {
      //resp.redirect("/admin/products");
      if (product) product.destroy();
      resp.status(200).json({ message: "Success" });
    })
    .catch((e) => {
      //passError(e, next);
      resp.status(500).json({ message: "Deleting Error" });
    });
};

module.exports = {
  getProducts,
  getAddProduct,
  postAddProduct,
  getEditProduct,
  postEditProduct,
  deleteProduct,
};
