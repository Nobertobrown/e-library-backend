const { validationResult } = require("express-validator");
const Book = require("../models/book");

exports.getBooks = (req, res, next) => {
  Book.find()
    .then((books) =>
      res
        .status(200)
        .json({ message: "Fetched books successfully!", books: books })
    )
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.getDetails = (req, res, next) => {
  const id = req.params.bookId;
  Book.findById(id)
    .then((book) => {
      if (!book) {
        const error = new Error("Book wasn't found!");
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json({ message: "Book found!", book: book });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.postBook = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({
      message: "Oops! An error occured while adding a book.",
      errors: errors,
    });
  }
  if (!req.file) {
    const error = new Error("No file provided!");
    error.statusCode = 422;
    errors.push(error);
    res.status(error.statusCode).json({ errors: errors });
  }
  // const title = req.body.title;
  // const author = req.body.author;
  // const publisher = req.body.publisher;
  // const isbn = req.body.isbn;
  // const publishedAt = req.body.publishedAt;
  // const languages = [];
  // const printLength = req.body.printLength;
  // const fields = [];
  // const desc = req.body.description;
  // const tags = [];
  // const rating = {};
  // const reviews = [];
  // const imgUrl = req.body.imgUrl;
  // const bookUrl = req.file.path;

  // create item in db
  const book = new Book(books[2]);
  book
    .save()
    .then((result) => {
      res.status(201).json({
        message: "Item created!",
        book: result,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.deleteBook = (req, res, next) => {};
