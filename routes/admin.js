const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin");
const checkAuth = require("../middleware/checkauth");
const { body } = require("express-validator");

const checkInput = [
  body("title", "Please add a valid Title")
    .isString()
    .isLength({ min: 3 })
    .trim(),
  //body("imageUrl", "Please upload a jpeg or png file").isString(),
  body("price", "Please add a float point Price").isFloat(),
  body("description", "Please add a valid Description")
    .isLength({ min: 5, max: 512 })
    .trim(),
];

router.get("/products", checkAuth, adminController.getProducts);
router.get("/add-product", checkAuth, adminController.getAddProduct);

router.post(
  "/add-product",
  //checkInput,
  checkAuth,
  adminController.postAddProduct
);

router.get("/edit-product/:id", checkAuth, adminController.getEditProduct);
router.post(
  "/edit-product",
  //checkInput,
  checkAuth,
  adminController.postEditProduct
);
router.delete("/product/:productId", checkAuth, adminController.deleteProduct);

module.exports = router;
