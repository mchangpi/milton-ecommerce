const httpStatus = require("http-status-codes");

const get404 = (req, resp, next) => {
  //resp.status(httpStatus.NOT_FOUND).send("<h1>Page Not Found</h1>");
  resp
    .status(httpStatus.NOT_FOUND)
    //.sendFile(path.join(rootDir, "views", "404.html"));
    .render("404", { pageTitle: "Page Not Found", path: "/404" });
};
module.exports = { get404 };
