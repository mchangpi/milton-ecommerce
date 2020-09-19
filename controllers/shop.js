const Product = require("../models/product");
const Cart = require("../models/cart");

const getProducts = (req, resp, next) => {
  Product.fetchAll((products) => {
    resp.render("shop/product-list", {
      pageTitle: "All Products",
      path: "/",
      prods: products,
    });
  });
};

const getSomeProduct = (req, resp) => {
  const prodId = req.params.id;
  Product.findById(prodId, (product) => {
    console.log("product ", product);
    resp.render("shop/product-detail", {
      pageTitle: "Product Detail",
      path: "/products",
      product,
    });
  });
};

const getIndex = (req, resp, next) => {
  Product.fetchAll((products) => {
    resp.render("shop/index", {
      pageTitle: "Shop",
      path: "/",
      prods: products,
    });
  });
};

const getCart = (req, resp, next) => {
  Product.fetchAll(() => {
    resp.render("shop/cart", {
      pageTitle: "Your Cart",
      path: "/cart",
    });
  });
};

const postCart = (req, resp, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId, (product) => {
    Cart.addProduct(product.id, product.price);
  });
  resp.redirect("/cart");
};

const getOrders = (req, resp, next) => {
  Product.fetchAll(() => {
    resp.render("shop/orders", {
      pageTitle: "Your Orders",
      path: "/orders",
    });
  });
};
const getCheckout = (req, resp, next) => {
  Product.fetchAll(() => {
    resp.render("shop/checkout", {
      pageTitle: "Checkout",
      path: "/checkout",
    });
  });
};

module.exports = {
  getProducts,
  getSomeProduct,
  getIndex,
  getCart,
  postCart,
  getOrders,
  getCheckout,
};
