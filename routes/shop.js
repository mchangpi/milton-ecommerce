const express = require("express");
const router = express.Router();

router.get("/", (req, resp, next) => {
  resp.json("Hello from Express");
});

module.exports = router;
