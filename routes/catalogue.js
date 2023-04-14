const express = require("express");
const { body } = require("express-validator");

const catalogueController = require("../controllers/catalogue");
const isAuth = require("../middleware/is-auth");

const router = express.Router();

//accesses the database in order to get books used to populate the frontend
router.get("/books", isAuth, catalogueController.getBooks);

router.get("/books/:bookId", isAuth, catalogueController.getDetails);

router.post(
  "/book",
  isAuth,
  [
    body("title", "Please enter a valid title.").trim().isLength({ max: 40 }),
    body("author", "Please enter a valid author.").trim().isLength({ max: 15 }),
    body("publisher").trim(),
    body("isbn", "Please enter a valid isbn.").trim().isISBN(),
    // body("publishedAt", "Please enter a valid date.").trim().isDate(),
    body("languages").trim(),
    body("printLength", "Please enter a valid length.")
      .trim()
      .isNumeric({ no_symbols: true }),
    body("fields").trim(),
    body("description").trim(),
    body("tags").trim(),
    body("rating").trim(),
    body("reviews").trim(),
    // body("imgUrl", "Please enter a valid image url.").trim().isURL(),
  ],
  catalogueController.postBook
);

module.exports = router;
