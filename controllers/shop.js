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
    .then((products) => {
      resp.render("shop/cart", {
        pageTitle: "Your Cart",
        path: "/cart",
        products,
      });
    })
    .catch((e) => console.log(e));
};

const postCart = (req, resp, next) => {
  const prodId = req.body.productId;
  let fetchedCart;
  let newQuantity = 1;
  req.user
    .getCart()
    .then((cart) => {
      fetchedCart = cart;
      return cart.getProducts({ where: { id: prodId } });
    })
    .then((cartProducts) => {
      if (cartProducts.length > 0) {
        let prodInCart = cartProducts[0];
        newQuantity = prodInCart.cartItem.quantity + 1;
        return prodInCart;
      } else {
        return Product.findByPk(prodId);
      }
    })
    .then((product) => {
      return fetchedCart.addProduct(product, {
        through: { quantity: newQuantity },
      });
    })
    .then(() => {
      resp.redirect("/cart");
    })
    .catch((err) => console.log(err));
};

const postCartDeleteItem = (req, resp) => {
  const prodId = req.body.productId;
  req.user
    .getCart()
    .then((cart) => {
      return cart.getProducts({ where: { id: prodId } });
    })
    .then((products) => {
      const product = products[0];
      return product.cartItem.destroy();
    })
    .then(() => {
      resp.redirect("/cart");
    })
    .catch((e) => console.log(e));
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
