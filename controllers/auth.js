const User = require("../models/user");
const bcrypt = require("bcryptjs");
//const sgMail = require("@sendgrid/mail");
const crypto = require("crypto");
const httpStatus = require("http-status-codes");
//const { validationResult } = require("express-validator");
const passError = require("../util/passerror");

require("dotenv").config();
//sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const getLogin = (req, resp, next) => {
  //const msg = req.flash("error");
  resp.render("auth/login", {
    pageTitle: "Login",
    path: "/login",
    //errorMessage: msg.length > 0 ? msg[0] : null,
    //oldInput: { email: "", password: "" },
    //validateErrors: [],
  });
};

const postLogin = (req, resp, next) => {
  const { email, password } = req.body;
  User.findOne({ email })
    .then((user) => {
      if (!user) {
        return resp
          .status(httpStatus.UNPROCESSABLE_ENTITY)
          .render("auth/login", {
            pageTitle: "Login",
            path: "/login",
            //errorMessage: "No such user, maybe you need to Signup first",
            //oldInput: { email, password },
            // validateErrors: [{ param: "email" }],
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
              //errorMessage: "Invalid Password",
              //oldInput: { email, password },
              //validateErrors: [{ param: "password" }],
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
/*
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
      const user = new User({
        email: email,
        password: hashedPassword,
        cart: { items: [] },
      });
      return user.save();
    })
    .then((afterUserSave) => {
      resp.redirect("/login");
      return sgMail.send({
        to: email,
        from: "mchangpi@gmail.com ",
        subject: "Singup Succeeded!!",
        text: "You successfully signed up!",
        html: "<h2>You successfully signed up!</h2>",
      });
    })
    .then((sendMailTakesTime) => {})
    .catch((e) => passError(e, next));
};

const getReset = (req, resp, next) => {
  const msg = req.flash("error");
  resp.render("auth/reset", {
    pageTitle: "Reset Password",
    path: "/reset",
    errorMessage: msg.length > 0 ? msg[0] : null,
  });
};

const postReset = (req, resp, next) => {
  crypto.randomBytes(32, (err, buf) => {
    if (err) {
      console.log(err);
      return resp.redirect("/reset");
    }
    const token = buf.toString("hex");
    User.findOne({ email: req.body.email })
      .then((user) => {
        if (!user) {
          req.flash("error", "No account with that Email found");
          return resp.redirect("/reset");
        }
        user.resetToken = token;
        user.resetTokenExpire = Date.now() + 60 * 60 * 1000;
        return user
          .save()
          .then((afterUserSave) => {
            resp.redirect("/");
            const resetMsg = {
              to: req.body.email,
              from: "mchangpi@gmail.com ",
              subject: "Reset Password",
              html: `
							<p>You requested a password reset</p>
							<p>Click this <a href="http://localhost:3000/reset/${token}">link</a> 
							to set a new password.</p>`,
            };
            sgMail.send(resetMsg);
          })
          .catch((e) => passError(e, next));
      })
      .then(() => {})
      .catch((e) => passError(e, next));
  });
};

const getNewPassword = (req, resp, next) => {
  const msg = req.flash("error");
  const token = req.params.token;
  User.findOne({
    resetToken: token,
    resetTokenExpire: { $gt: Date.now() },
  })
    .then((user) => {
      resp.render("auth/new-password", {
        pageTitle: "New Password",
        path: "/new-password",
        userId: user._id.toString(),
        passwordToken: token,
        errorMessage: msg.length > 0 ? msg[0] : null,
      });
    })
    .catch((e) => passError(e, next));
};

const postNewPassword = (req, resp, next) => {
  const { password, userId, passwordToken } = req.body;
  let resetUser;
  User.findOne({
    _id: userId,
    resetToken: passwordToken,
    resetTokenExpire: { $gt: Date.now() },
  })
    .then((user) => {
      resetUser = user;
      return bcrypt.hash(password, 12);
    })
    .then((hashedPassword) => {
      resetUser.password = hashedPassword;
      resetUser.resetToken = resetUser.resetExpire = undefined;
      return resetUser.save();
    })
    .then((afterUserSave) => {
      resp.redirect("/login");
    })
    .catch((e) => passError(e, next));
};
*/
module.exports = {
  getLogin,
  postLogin,
  postLogout,
  /*
  getSignup,
  postSignup,
  getReset,
  postReset,
  getNewPassword,
  postNewPassword,*/
};
