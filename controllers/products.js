const products = [];

const getAddProduct = (req, resp, next) => {
  //resp.sendFile(path.join(rootDir, "views", "add-product.html"));
  resp.render("add-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    formsCSS: true,
    productCSS: true,
    activeAddProduct: true,
  });
};

const postAddProduct = (req, resp, next) => {
  console.log("req body", req.body);
  products.push({ title: req.body.title });
  resp.redirect("/");
};

const getProducts = (req, resp, next) => {
  console.log("products ", products);
  //resp.sendFile(path.join(rootDir, "views", "shop.html"));
  resp.render("shop", {
    pageTitle: "Shop",
    path: "/",
    prods: products,
    hasProducts: products.length > 0,
    productCSS: true,
    activeShop: true,
  });
};

module.exports = { products, getAddProduct, postAddProduct, getProducts };
