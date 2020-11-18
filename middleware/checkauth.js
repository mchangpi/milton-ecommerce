const checkAuth = (req, resp, next) => {
  if (!req.session.isLoggedin) {
    resp.redirect("/login");
  }
  next();
};

module.exports = checkAuth;
