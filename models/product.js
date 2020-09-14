const fs = require("fs");
const path = require("path");

const filePath = path.join(
  path.dirname(process.mainModule.filename),
  "data",
  "products.json"
);

class Product {
  constructor(t) {
    this.title = t;
  }

  save = () => {
    console.log("filePath ", filePath);
    fs.readFile(filePath, (err, content) => {
      let products = [];
      if (!err) {
        products = JSON.parse(content);
      }
      products.push(this);
      fs.writeFile(filePath, JSON.stringify(products), (err) => {
        console.log(err);
      });
    });
  };

  static fetchAll = (cb) => {
    console.log("filePath ", filePath);
    fs.readFile(filePath, (err, content) => {
      if (err) {
        return cb([]);
      }
      return cb(JSON.parse(content));
    });
  };
}

module.exports = Product;
