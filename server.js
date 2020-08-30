const http = require("http");
const express = require("express");

const app = express();
const server = http.createServer(app);

app.use((req, resp, next) => {
  console.log("In the middleware");
  next();
});

app.use((req, resp, next) => {
  console.log("In another middleware");
  resp.json("Hello from Express");
});

server.listen(3000, () => {
  console.log("Node is listening on port 3000...");
});
