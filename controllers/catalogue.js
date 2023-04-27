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
