const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const path = require("path");

const filePath = path.join(
  path.dirname(process.mainModule.filename),
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
  constructor(title, imageUrl, description, price) {
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  save = () => {
    this.id = uuidv4().toString();
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
