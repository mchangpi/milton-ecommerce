const express = require("express");
const router = express.Router();

router.get("/add-product", (req, resp, next) => {
  resp.send(`<form action="/admin/product" method="Post">
						<input type="text" name="title"/>
						<button type="submit" value="Submit">Submit</button>`);
});

router.post("/product", (req, resp, next) => {
  console.log("req body", req.body);
  resp.redirect("/");
});

module.exports = router;
