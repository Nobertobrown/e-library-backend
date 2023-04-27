const { validationResult } = require("express-validator");
const Book = require("../models/book");

exports.postBook = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Oops! An error occured while uploading a book.");
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }

  if (!req.file) {
    const error = new Error("No file provided!");
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }

  const title = req.body.title;
  const author = req.body.author;
  const publisher = req.body.publisher;
  const isbn = req.body.isbn;
  const publishedAt = req.body.publicationDate;
  const desc = req.body.description;
  const languages = [...req.body.languages.value];
  const fields = [...req.body.fields.value];
  const tags = [...req.body.tags.value];
  const rating = { value: req.body.rating.value, rates: req.body.rating.rates };
  const bookUrl = req.file.path;
  // const printLength = req.body.printLength;
  // const imgUrl = req.body.imgUrl;

  const book = new Book({
    title: title,
    author: author,
    publisher: publisher,
    isbn: isbn,
    publishedAt: publishedAt,
    description: desc,
    rating: rating,
    languages: languages,
    // printLength: printLength,
    // imgUrl: imgUrl,
    fields: fields,
    tags: tags,
  });
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

exports.deleteBook = (req, res, next) => { };