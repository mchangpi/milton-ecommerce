const Product = require("../models/product");
const Cart = require("../models/cart");

const getIndex = (req, resp, next) => {
  Product.findAll()
    .then((products) => {
      resp.render("shop/index", {
        pageTitle: "Shop",
        path: "/",
        prods: products,
      });
    })
    .catch((e) => console.trace(e));
};

const getProducts = (req, resp, next) => {
  Product.findAll()
    .then((products) => {
      resp.render("shop/product-list", {
        pageTitle: "All Products",
        path: "/",
        prods: products,
      });
    })
    .catch((e) => console.trace(e));
};

const getSomeProduct = (req, resp) => {
  const prodId = req.params.id;
  Product.findByPk(prodId)
    .then((product) => {
      resp.render("shop/product-detail", {
        pageTitle: "Product Detail",
        path: "/products",
        product: product,
      });
    })
    .catch((e) => console.trace(e));
};

const getCart = (req, resp, next) => {
  req.user
    .getCart()
    .then((cart) => {
      return cart.getProducts();
    })
    .then((products) => {});
  /*
  Cart.getCart((cart) => {
    Product.fetchAll((products) => {
      const cartProducts = [];
      for (product of products) {
        const prodInCart = cart.products.find((p) => p.id === product.id);
        if (prodInCart) {
          cartProducts.push({ data: product, qty: prodInCart.qty });
        }
      }
      resp.render("shop/cart", {
        pageTitle: "Your Cart",
        path: "/cart",
        products: cartProducts,
      });
    });
  });*/
};

const postCart = (req, resp, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId, (product) => {
    Cart.addProduct(product.id, product.price);
  });
  resp.redirect("/cart");
};

const postCartDeleteItem = (req, resp) => {
  const prodId = req.body.productId;
  console.log("del cart prod ", prodId);
  Product.findById(prodId, (product) => {
    Cart.deleteProduct(product.id, product.price);
    resp.redirect("/cart");
  });
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
  postCartDeleteItem,
  getOrders,
  getCheckout,
};
