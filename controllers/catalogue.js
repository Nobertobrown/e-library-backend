const { validationResult } = require("express-validator");
const Book = require("../models/book");
const Review = require("../models/review");
const User = require("../models/user");

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
    const error = new Error("Oops! An error occured while uploading a book.");
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }

  // if (!req.file) {
  //   const error = new Error("No file provided!");
  //   error.statusCode = 422;
  //   error.data = errors.array();
  //   throw error;
  // }
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
  // const printLength = req.body.printLength;
  // const imgUrl = req.body.imgUrl;
  // const bookUrl = req.file.path;

  // create item in db
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

exports.postReview = (req, res, next) => {
  const userRating = req.body.rating;
  const userReview = req.body.review;
  const bookId = req.params.bookId;
  const userId = req.userId;
  let creator;
  let book;

  const review = new Review({
    userId: userId,
    bookId: bookId,
    rating: userRating,
    review: userReview
  })

  review
    .save()
    .then((result) => {
      return User.findById(userId);
    })
    .then((user) => {
      creator = user;
      user.reviews.push(review);
      return user.save();
    })
    .then((result) => {
      return Book.findById(bookId);
    })
    .then((b) => {
      book = b;
      book.reviews.push(review);
      return book.save();
    })
    .then((result) => {
      res.status(201).json({
        message: "Review saved successfully!",
        review: review,
        creator: creator.name,
        book: book.name
      })
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
}
