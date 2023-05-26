const express = require("express");

const catalogueController = require("../controllers/catalogue");
const isAuth = require("../middleware/is-auth");

const router = express.Router();

//accesses the database in order to get books used to populate the frontend
router.get("/books", isAuth, catalogueController.getBooks);

router.get("/books/:bookId", isAuth, catalogueController.getDetails);

router.get("/books/:bookId/download", catalogueController.downloadBook)

router.get("/books/:bookId/read", catalogueController.readBook)

router.post("/books/:bookId/review", isAuth, catalogueController.postReview);

module.exports = router;
