const User = require("../models/user");
const bcrypt = require("bcryptjs");
const httpStatus = require("http-status-codes");
const { validationResult } = require("express-validator");
const passError = require("../util/passerror");

if (process.env.NODE_ENV === "development") {
  require("dotenv").config();
}

const getLogin = (req, resp, next) => {
  const msg = req.flash("error");
  resp.render("auth/login", {
    pageTitle: "Login",
    path: "/login",
    errorMessage: msg.length > 0 ? msg[0] : null,
    oldInput: { email: "", password: "" },
    validateErrors: [],
  });
};

const postLogin = async (req, resp, next) => {
  const { email, password } = req.body;
  const validateErrors = validationResult(req);
  if (!validateErrors.isEmpty()) {
    return resp.status(httpStatus.UNPROCESSABLE_ENTITY).render("auth/login", {
      pageTitle: "Login",
      path: "/login",
      errorMessage: validateErrors.array()[0].msg,
      oldInput: { email, password },
      validateErrors: validateErrors.array(),
    });
  }
  const user = await User.findOne({ where: { email } });
  if (!user) {
    return resp.status(httpStatus.UNPROCESSABLE_ENTITY).render("auth/login", {
      pageTitle: "Login",
      path: "/login",
      errorMessage: "No such user, maybe you need to Signup first",
      oldInput: { email, password },
      validateErrors: [{ param: "email" }],
    });
  }
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return resp.status(httpStatus.UNPROCESSABLE_ENTITY).render("auth/login", {
      pageTitle: "Login",
      path: "/login",
      errorMessage: "Invalid Password",
      oldInput: { email, password },
      validateErrors: [{ param: "password" }],
    });
  }
  req.session.isLoggedin = true;
  req.session.user = user;
  return req.session.save((err) => {
    resp.redirect("/");
  });
};

const postLogout = (req, resp, next) => {
  req.session.destroy((err) => {
    console.log("destroy session");
    resp.redirect("/");
  });
};

const getSignup = (req, resp, next) => {
  const msg = req.flash("error");
  resp.render("auth/signup", {
    pageTitle: "Sign up",
    path: "/signup",
    errorMessage: msg.length > 0 ? msg[0] : null,
    oldInput: { email: "", password: "", confirmPassword: "" },
    validateErrors: [],
  });
};

const postSignup = async (req, resp, next) => {
  const { email, password } = req.body;
  const validateErrors = validationResult(req);
  // console.log("validate errors ", validateErrors); // {formatter, errors}
  if (!validateErrors.isEmpty()) {
    return resp.status(httpStatus.UNPROCESSABLE_ENTITY).render("auth/signup", {
      pageTitle: "Sign up",
      path: "/signup",
      errorMessage: validateErrors.array()[0].msg,
      oldInput: { email, password, confirmPassword: req.body.confirmPassword },
      validateErrors: validateErrors.array(),
    });
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  const user = await User.create({
    email: email,
    password: hashedPassword,
  });
  await user.createCart();
  resp.redirect("/login");
};

module.exports = {
  getLogin,
  postLogin,
  postLogout,
  getSignup,
  postSignup,
};
