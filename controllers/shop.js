//const mongoose = require("mongoose");
const Product = require("../models/product");
const Order = require("../models/order");
const passError = require("../util/passerror");
const fs = require("fs");
const path = require("path");
//const PDFKit = require("pdfkit");
require("dotenv").config();

//const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);

const ITEMS_PER_PAGE = 2;

const getIndex = (req, resp, next) => {
  console.log("query ", req.query);
  const page = parseInt(req.query.page) || 1;
  let totalItems;
  Product.count()
    .then((num) => {
      totalItems = num;
      //console.log("total ", totalItems);
      return Product.findAll({
        offset: (page - 1) * ITEMS_PER_PAGE,
        limit: ITEMS_PER_PAGE,
      });
    })
    .then((products) => {
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
    })
    .catch((e) => passError(e, next));
};

const getProducts = (req, resp, next) => {
  console.log("query ", req.query);
  const page = parseInt(req.query.page) || 1;
  let totalItems;
  Product.count()
    .then((num) => {
      totalItems = num;
      //console.log("total ", totalItems);
      return Product.findAll({
        offset: (page - 1) * ITEMS_PER_PAGE,
        limit: ITEMS_PER_PAGE,
      });
    })
    .then((products) => {
      resp.render("shop/product-list", {
        pageTitle: "All Products",
        path: "/products",
        prods: products,
        currentPage: page,
        hasNextPage: ITEMS_PER_PAGE * page < totalItems,
        hasPreviousPage: page > 1,
        nextPage: page + 1,
        previousPage: page - 1,
        lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
      });
    })
    .catch((e) => passError(e, next));
};

const getSomeProduct = (req, resp, next) => {
  const prodId = req.params.id;
  Product.findByPk(prodId)
    .then((product) => {
      resp.render("shop/product-detail", {
        pageTitle: "Product Detail",
        path: "/products",
        product,
      });
    })
    .catch((e) => passError(e, next));
};

const getCart = (req, resp, next) => {
  //console.log(req.user);
  //req.user
  //.populate("cart.items.productId")
  //.execPopulate()
  //.then((user) => {
  //console.log("user cart ", user.cart.items);
  resp.render("shop/cart", {
    pageTitle: "Your Cart",
    path: "/cart",
    products: req.user.getCart().items,
  });
  //})
  //.catch((e) => passError(e, next));
};

const getCheckout = (req, resp, next) => {
  let products;
  let total = 0;
  req.user
    .populate("cart.items.productId")
    .execPopulate()
    .then((user) => {
      products = user.cart.items;
      products.forEach((p) => {
        total += p.quantity * p.productId.price;
      });
      console.log("total ", total);
      return stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: products.map((p) => {
          return {
            name: p.productId.title,
            description: p.productId.description,
            amount: p.productId.price * 100,
            currency: "usd",
            quantity: p.quantity,
          };
        }),
        success_url:
          req.protocol + "://" + req.get("host") + "/checkout/success",
        cancel_url: req.protocol + "://" + req.get("host") + "/checkout/cancel",
      });
    })
    .then((session) => {
      return resp.render("shop/checkout", {
        pageTitle: "Checkout",
        path: "/checkout",
        products,
        totalSum: total,
        sessionId: session.id,
      });
    })
    .catch((e) => passError(e, next));
};

const postCart = (req, resp, next) => {
  const prodId = /*mongoose.Types.ObjectId*/ req.body.productId;
  Product.findByPk(prodId)
    .then((product) => {
      return req.user.addToCart(product);
    })
    .then(() => resp.redirect("/cart"))
    .catch((e) => passError(e, next));
};

const postCartDeleteItem = (req, resp, next) => {
  const prodId = mongoose.Types.ObjectId(req.body.productId);
  req.user
    .removeFromCart(prodId)
    .then(() => {
      resp.redirect("/cart");
    })
    .catch((e) => passError(e, next));
};

const getOrders = (req, resp, next) => {
  Order.find({ "user.userId": req.user.id })
    .then((orders) => {
      resp.render("shop/orders", {
        pageTitle: "Your Orders",
        path: "/orders",
        orders,
      });
    })
    .catch((e) => passError(e, next));
};

const getCheckoutSuccess = (req, resp, next) => {
  req.user
    .populate("cart.items.productId")
    .execPopulate()
    .then((user) => {
      console.log("cart items ", user.cart.items);
      cartProducts = user.cart.items.map((i) => {
        return { product: { ...i.productId._doc }, quantity: i.quantity };
      });
      const order = new Order({
        user: {
          email: req.user.email,
          userId: req.user,
        },
        products: cartProducts,
      });
      return order.save();
    })
    .then(() => {
      return req.user.clearCart();
    })
    .then(() => {
      resp.redirect("/orders");
    })
    .catch((e) => passError(e, next));
};
/*
const postOrder = (req, resp, next) => {
  req.user
    .populate("cart.items.productId")
    .execPopulate()
    .then((user) => {
      console.log("cart items ", user.cart.items);
      cartProducts = user.cart.items.map((i) => {
        return { product: { ...i.productId._doc }, quantity: i.quantity };
      });
      const order = new Order({
        user: {
          email: req.user.email,
          userId: req.user,
        },
        products: cartProducts,
      });
      return order.save();
    })
    .then(() => {
      return req.user.clearCart();
    })
    .then(() => {
      resp.redirect("/orders");
    })
    .catch((e) => passError(e, next));
};
*/
const getInvoice = (req, resp, next) => {
  const { orderId } = req.params;
  Order.findById(orderId)
    .then((order) => {
      if (!order) {
        return passError(new Error("No order found"), next);
      }
      if (order.user.userId.toString() !== req.user.id.toString()) {
        return passError(new Error("Unauthorized", next));
      }
      const invoiceName = "invoice-" + orderId + ".pdf";
      const invoicePath = path.join("data", "invoices", invoiceName);
      const pdfDoc = new PDFKit();
      resp.setHeader("Content-Type", "application/pdf");
      resp.setHeader(
        "Content-Disposition",
        `inline; filename="${invoiceName}"`
      );
      pdfDoc.pipe(fs.createWriteStream(invoicePath));
      pdfDoc.pipe(resp);
      pdfDoc.fontSize(20).text("Invoice" /*, { underline: true }*/);
      let total = 0;
      pdfDoc.fontSize(20).text("------------------------------");
      order.products.forEach((p) => {
        total += p.quantity * p.product.price;
        pdfDoc
          .fontSize(16)
          .text(
            p.product.title + " - " + p.quantity + " x $" + p.product.price
          );
      });
      pdfDoc.fontSize(20).text("------------------------------");
      pdfDoc.fontSize(20).text("Total price: $" + total);
      pdfDoc.end();
    })
    .catch((e) => passError(e, next));
};

module.exports = {
  getIndex,
  getProducts,
  getSomeProduct,
  getCart,
  postCart,
  postCartDeleteItem,
  getCheckout,
  getOrders,
  getCheckoutSuccess,
  // postOrder,
  getInvoice,
};
