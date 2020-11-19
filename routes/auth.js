const express = require("express");
const authController = require("../controllers/auth");
const { check, body } = require("express-validator");
const Member = require("../models/member");

const router = express.Router();

router.get("/login", authController.getLogin);
router.post(
  "/login",
  [
    body("email", "Please enter a valid email").isEmail().normalizeEmail(),
    body("password", "Please enter a valid password")
      .isLength({ min: 5 })
      .isAlphanumeric()
      .trim(),
  ],
  authController.postLogin
);
router.post("/logout", authController.postLogout);
router.get("/signup", authController.getSignup);
router.post(
  "/signup",
  [
    check("email")
      .isEmail()
      .withMessage("Please enter a valid email")
      .normalizeEmail()
      .custom(async (value, { req }) => {
        const member = await Member.findOne({ where: { email: value } });
        if (member) {
          return Promise.reject(
            "This Email is already registered. Please pick another one."
          );
        }
      }),
    body("password", "Password should be at least 5 characters")
      .isLength({ min: 5 })
      .isAlphanumeric()
      .trim(),
    body("confirmPassword")
      .trim()
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error("Passwords have to match");
        }
        return true;
      }),
  ],
  authController.postSignup
);
/*
router.get("/reset", authController.getReset);
router.post("/reset", authController.postReset);

router.get("/reset/:token", authController.getNewPassword);
router.post("/new-password", authController.postNewPassword);
*/
module.exports = router;
