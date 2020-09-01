const express = require("express");
const router = express.Router();
const path = require("path");
const rootDir = require("../util/path");

router.get("/", (req, resp, next) => {
  //resp.json("Hello from Express");
  resp.sendFile(path.join(rootDir, "views", "shop.html"));
});

module.exports = router;
