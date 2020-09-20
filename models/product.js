const { v4: uuidv4 } = require("uuid");
const Cart = require("./cart");
const db = require("../util/database");

class Product {
  constructor(id, title, imageUrl, description, price) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  save = () => {
    return db.execute(
      `insert into products (title, price, imageUrl, description) values (?, ?, ?, ?)`,
      [this.title, this.price, this.imageUrl, this.description]
    );
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

  static fetchAll = () => {
    return db.execute("select * from products");
  };

  static findById = (id, cb) => {
    getProductsFromFile((products) => {
      const product = products.find((p) => p.id === id);
      cb(product);
    });
  };
}

module.exports = Product;
