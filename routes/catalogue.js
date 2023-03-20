const express = require("express");

const catalogueController = require("../controllers/catalogue");

const router = express.Router();

//accesses the database in order to get books used to populate the frontend
router.get("/books", catalogueController.getBooks);

router.get("/books/:bookId", catalogueController.getDetails);

router.post("/book", catalogueController.postBook);

module.exports = router;
