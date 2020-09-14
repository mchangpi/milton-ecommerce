const fs = require("fs");
const path = require("path");

const filePath = path.join(
  path.dirname(process.mainModule.filename),
  "data",
  "products.json"
);

const getProductsFromFile = (cb) => {
  fs.readFile(filePath, (err, content) => {
    if (err) {
      return cb([]);
    } else {
      return cb(JSON.parse(content));
    }
  });
};

class Product {
  constructor(t) {
    this.title = t;
  }

  save = () => {
    getProductsFromFile((products) => {
      products.push(this);
      fs.writeFile(filePath, JSON.stringify(products), (err) => {
        console.log(err);
      });
    });
  };

  static fetchAll = (cb) => {
    getProductsFromFile(cb);
  };
}

module.exports = Product;
