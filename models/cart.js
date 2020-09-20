const fs = require("fs");
const path = require("path");

const filePath = path.join(
  // path.dirname(process.mainModule.filename), // deprecated
  path.dirname(require.main.filename),
  "data",
  "cart.json"
);

class Cart {
  static addProduct = (id, price) => {
    fs.readFile(filePath, (err, content) => {
      console.log("Add product id ", id, " price ", price);
      // cart: products, totalPrice
      // product: id, qty
      let cart = { products: [], totalPrice: 0 };
      if (!err) {
        cart = JSON.parse(content);
      }
      //console.log("old cart ", cart);
      const prodIdx = cart.products.findIndex((p) => p.id === id);
      if (prodIdx > -1) {
        let updatedProduct = { ...cart.products[prodIdx] };
        updatedProduct.qty += 1;
        cart.products[prodIdx] = updatedProduct;
      } else {
        cart.products.push({ id, qty: 1 });
      }
      cart.totalPrice += parseFloat(price);
      console.log("updated cart ", cart);
      fs.writeFile(filePath, JSON.stringify(cart), (err) => {
        if (err) console.trace(err);
      });
    });
  };
  static deleteProduct = (id, price) => {
    fs.readFile(filePath, (err, content) => {
      if (err) return;
      const updatedCart = { ...JSON.parse(content) };
      const prodInCart = updatedCart.products.find((p) => p.id === id);
      if (!prodInCart) return;
      updatedCart.products = updatedCart.products.filter((p) => p.id !== id);
      updatedCart.totalPrice -= price * prodInCart.qty;
      console.log("update cart ", updatedCart);
      fs.writeFile(filePath, JSON.stringify(updatedCart), (err) => {
        if (err) console.trace(err);
      });
    });
  };
  static getCart = (cb) => {
    fs.readFile(filePath, (err, content) => {
      const cart = JSON.parse(content);
      if (!err) {
        cb(cart);
      } else {
        cb(null);
      }
    });
  };
}

module.exports = Cart;
