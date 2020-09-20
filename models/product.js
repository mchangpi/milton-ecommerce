const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const path = require("path");
const Cart = require("./cart");

const filePath = path.join(
  // path.dirname(process.mainModule.filename), // deprecated
  path.dirname(require.main.filename),
  "data",
  "products.json"
);

const getProductsFromFile = (cb) => {
  fs.readFile(filePath, (err, content) => {
    if (err || Object.keys(content).length < 1) {
      return cb([]);
    } else {
      console.log("json length ", Object.keys(content).length);
      return cb(JSON.parse(content));
    }
  });
};

class Product {
  constructor(id, title, imageUrl, description, price) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  save = () => {
    getProductsFromFile((products) => {
      let updatedProducts = [...products];
      if (this.id) {
        const prodIdx = products.findIndex((p) => p.id === this.id);
        updatedProducts[prodIdx] = this;
      } else {
        this.id = uuidv4().toString();
        updatedProducts = [...products, this];
      }
      console.log("update prodcuts ", updatedProducts);
      fs.writeFile(filePath, JSON.stringify(updatedProducts), (err) => {
        if (err) console.trace(err);
      });
    });
  };

  static deleteById = (id) => {
    getProductsFromFile((products) => {
      const product = products.find((p) => p.id === id);
      const filteredProducts = products.filter((p) => p.id !== id);
      console.log("update products ", filteredProducts);
      fs.writeFile(filePath, JSON.stringify(filteredProducts), (err) => {
        if (!err) {
          Cart.deleteProduct(id, product.price);
        }
      });
    });
  };

  static fetchAll = (cb) => {
    getProductsFromFile(cb);
  };

  static findById = (id, cb) => {
    getProductsFromFile((products) => {
      const product = products.find((p) => p.id === id);
      cb(product);
    });
  };
}

module.exports = Product;
