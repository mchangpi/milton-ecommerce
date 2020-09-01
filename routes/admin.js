const express = require("express");
const router = express.Router();
const path = require("path");
const rootDir = require("../util/path");

router.get("/add-product", (req, resp, next) => {
  resp.sendFile(path.join(rootDir, "views", "add-product.html"));
});

router.post("/add-product", (req, resp, next) => {
  console.log("req body", req.body);
  resp.redirect("/");
});

module.exports = router;
