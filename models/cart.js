const fs = require("fs");
const path = require("path");

const filePath = path.join(
  // path.dirname(process.mainModule.filename), // deprecated
  path.dirname(require.main.filename),
  "data",
  "cart.json"
);

class Cart {
  static addProduct(id, price) {
    fs.readFile(filePath, (err, content) => {
      console.log("Add product id ", id, " price ", price);
      // cart: products, totalPrice
      // product: id, qty
      let cart = { products: [], totalPrice: 0 };
      if (!err) {
        cart = JSON.parse(content);
      }
      console.log("old cart ", cart);
      const prodIdx = cart.products.findIndex((p) => p.id === id);
      if (prodIdx > -1) {
        let updatedProduct = { ...cart.products[prodIdx] };
        updatedProduct.qty += 1;
        cart.products[prodIdx] = updatedProduct;
      } else {
        const newProduct = { id, qty: 1 };
        cart.products.push(newProduct);
      }
      cart.totalPrice += parseFloat(price);
      console.log("updated cart ", cart);
      fs.writeFile(filePath, JSON.stringify(cart), (err) => {
        console.log(err);
      });
    });
  }
}

module.exports = Cart;
