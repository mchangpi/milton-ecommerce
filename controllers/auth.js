const User = require("../models/user");
const bcrypt = require("bcryptjs");
//const sgMail = require("@sendgrid/mail");
//const crypto = require("crypto");
const httpStatus = require("http-status-codes");
const { validationResult } = require("express-validator");
const passError = require("../util/passerror");

if (process.env.NODE_ENV === "development") {
  require("dotenv").config();
}
//sgMail.setApiKey(process.env.SENDGRID_API_KEY);

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

const postLogin = (req, resp, next) => {
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
  User.findOne({ where: { email } })
    .then((user) => {
      if (!user) {
        return resp
          .status(httpStatus.UNPROCESSABLE_ENTITY)
          .render("auth/login", {
            pageTitle: "Login",
            path: "/login",
            errorMessage: "No such user, maybe you need to Signup first",
            oldInput: { email, password },
            validateErrors: [{ param: "email" }],
          });
      }
      bcrypt
        .compare(password, user.password)
        .then((doMatch) => {
          if (doMatch) {
            req.session.isLoggedin = true;
            req.session.user = user;
            return req.session.save((err) => {
              resp.redirect("/");
            });
          }
          return resp
            .status(httpStatus.UNPROCESSABLE_ENTITY)
            .render("auth/login", {
              pageTitle: "Login",
              path: "/login",
              errorMessage: "Invalid Password",
              oldInput: { email, password },
              validateErrors: [{ param: "password" }],
            });
        })
        .catch((e) => passError(e, next));
    })
    .catch((e) => passError(e, next));
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

const postSignup = (req, resp, next) => {
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

  bcrypt
    .hash(password, 12)
    .then((hashedPassword) => {
      return User.create({
        email: email,
        password: hashedPassword,
        //cart: { items: [] },
      });
      //return user.save();
    })
    .then((user) => {
      return user.createCart();
      /*
      return sgMail.send({
        to: email,
        from: "mchangpi@gmail.com ",
        subject: "Singup Succeeded!!",
        text: "You successfully signed up!",
        html: "<h2>You successfully signed up!</h2>",
      });*/
    })
    .then((afterCreateCart) => {
      resp.redirect("/login");
    })
    .catch((e) => passError(e, next));
};

module.exports = {
  getLogin,
  postLogin,
  postLogout,
  getSignup,
  postSignup,
};
