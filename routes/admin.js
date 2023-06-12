const express = require('express');
const { body } = require("express-validator");

const adminController = require("../controllers/admin");
const isAuth = require("../middleware/is-auth");
const isAdmin = require("../middleware/is-admin");

const router = express.Router();

router.put(
  "/book",
  isAuth,
  isAdmin,
  [
    body("title", "Please enter a valid title.").trim().isLength({ max: 40 }),
    body("author", "Please enter a valid author.").trim().isLength({ max: 15 }),
    body("publisher").trim(),
    body("isbn", "Please enter a valid isbn.").trim().isISBN(),
    body("publicationDate", "Please enter a valid date.").trim(),//.isDate(),
    // body("printLength", "Please enter a valid length.")
    //   .trim()
    //   .isNumeric({ no_symbols: true }),
    body("description").trim(),
    // body("imgUrl", "Please enter a valid image url.").trim().isURL(),
  ],
  adminController.postBook
);

router.post("/book/delete", isAuth, isAdmin, adminController.deleteBook);

router.post("/send-letter", isAuth, isAdmin, adminController.sendNewsletter);

module.exports = router;

// TODO
// Add is Admin middleware