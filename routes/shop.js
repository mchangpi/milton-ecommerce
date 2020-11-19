const express = require("express");
const router = express.Router();
const shopController = require("../controllers/shop");
const checkAuth = require("../middleware/checkauth");

router.get("/", shopController.getIndex);
//router.get("/products", shopController.getProducts);
router.get("/products/:id", shopController.getSomeProduct);

router.get("/cart", checkAuth, shopController.getCart);
router.post("/cart", checkAuth, shopController.postCart);
router.post("/cart-delete-item", checkAuth, shopController.postCartDeleteItem);

router.get("/checkout", checkAuth, shopController.getCheckout);
/* we do not need stripe
router.get("/checkout/success", checkAuth, shopController.getCheckoutSuccess);
router.get("/checkout/cancel", checkAuth, shopController.getCheckout);
*/

router.get("/orders", checkAuth, shopController.getOrders);
//router.post("/create-order", checkAuth, shopController.postOrder);
router.get("/orders/:orderId", checkAuth, shopController.getInvoice);

module.exports = router;
