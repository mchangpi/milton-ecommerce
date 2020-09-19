const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin");

router.get("/products", adminController.getAdminProducts);
router.get("/add-product", adminController.getAddProduct);
router.post("/add-product", adminController.postAddProduct);
router.get("/edit-product/:id", adminController.getEditProduct);

module.exports = { router };
