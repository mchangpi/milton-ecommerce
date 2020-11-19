const Product = require("../models/product");
/*
const Order = require("../models/order");
const passError = require("../util/passerror");
const fs = require("fs");
const path = require("path");
*/
//const PDFKit = require("pdfkit");
if (process.env.NODE_ENV === "development") {
  require("dotenv").config();
}

const ITEMS_PER_PAGE = 3;

const getIndex = async (req, resp, next) => {
  const page = parseInt(req.query.page) || 1;
  const totalItems = await Product.count();
  //console.log("total ", totalItems);
  const products = await Product.findAll({
    offset: (page - 1) * ITEMS_PER_PAGE,
    limit: ITEMS_PER_PAGE,
  });
  resp.render("shop/index", {
    pageTitle: "Shop",
    path: "/",
    prods: products,
    currentPage: page,
    hasNextPage: ITEMS_PER_PAGE * page < totalItems,
    hasPreviousPage: page > 1,
    nextPage: page + 1,
    previousPage: page - 1,
    lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
  });
};

const getSomeProduct = async (req, resp, next) => {
  const prodId = req.params.id;
  const product = await Product.findByPk(prodId);
  resp.render("shop/product-detail", {
    pageTitle: "Product Detail",
    path: "/products",
    product,
  });
};

const getCart = async (req, resp, next) => {
  const cart = await req.member.getCart();
  const products = await cart.getProducts();
  let total = 0;
  products.forEach((product) => {
    total += product.cartItem.quantity * product.price;
  });

  resp.render("shop/cart", {
    pageTitle: "Your Cart",
    path: "/cart",
    products,
    total: total.toFixed(2),
  });
};

const postCart = async (req, resp, next) => {
  const prodId = req.body.productId;
  const fetchedCart = await req.member.getCart();
  const cartProducts = await fetchedCart.getProducts({ where: { id: prodId } });

  let prodInCart;
  let newQuantity = 1;
  if (cartProducts.length > 0) {
    prodInCart = cartProducts[0];
    newQuantity = prodInCart.cartItem.quantity + 1;
  } else {
    prodInCart = await Product.findByPk(prodId);
  }
  await fetchedCart.addProduct(prodInCart, {
    through: { quantity: newQuantity },
  });
  resp.redirect("/cart");
};

const postCartDeleteItem = async (req, resp, next) => {
  const prodId = req.body.productId;
  const cart = await req.member.getCart();
  const products = await cart.getProducts({ where: { id: prodId } });
  if (products.length > 0) {
    await products[0].cartItem.destroy();
  }
  resp.redirect("/cart");
};

const getCheckout = async (req, resp, next) => {
  const fetchedCart = await req.member.getCart();
  const cartProducts = await fetchedCart.getProducts();
  let order = await req.member.createOrderMain({ total: 0 });
  cartProducts.forEach((product) => {
    order.total += product.cartItem.quantity * product.price;
  });
  order = await order.save();
  await order.addProducts(
    cartProducts.map((product) => {
      product.orderSub = { quantity: product.cartItem.quantity };
      return product;
    })
  );
  await fetchedCart.setProducts(null);
  resp.redirect("/orders");
};

const getOrders = async (req, resp, next) => {
  const orders = await req.member.getOrderMains({
    include: { model: Product, as: "products" },
  });
  //console.log("orders: ", orders[0].products);
  resp.render("shop/orders", {
    pageTitle: "Your Orders",
    path: "/orders",
    orders,
  });
};

module.exports = {
  getIndex,
  //getProducts,
  getSomeProduct,
  getCart,
  postCart,
  postCartDeleteItem,
  getCheckout,
  getOrders,
  //getInvoice,
};
