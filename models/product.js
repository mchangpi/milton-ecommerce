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
