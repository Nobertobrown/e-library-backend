const express = require("express");
const { body } = require("express-validator");

const User = require("../models/user");
const authController = require("../controllers/auth");

const router = express.Router();

router.route("/signup").put(
  [
    body("username", "Please enter a valid username").trim().not().isEmpty(),
    body("email", "Please enter a valid email")
      .trim()
      .isEmail()
      .custom((value, { req }) => {
        return User.findOne({ email: value })
          .then((user) => {
            if (user) {
              Promise.reject("Email address already exists!")
              // .then((result) => {
              //   return new Error(result)
              // }).catch((err) => {
              //   console.log(err);
              // });
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }),
    body("password", "Please enter a strong password")
      .trim()
      .isLength({ min: 6 }),
    body("confirmPassword", "The passwords entered do not match!")
      .trim()
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error("The passwords entered do not match!");
        }
        return true;
      }),
    // .normalizeEmail(),
  ],
  authController.SignUp
);

router.route("/login").post(authController.Login);

module.exports = router;
//TODO: Handle the promise when the email provided already exists