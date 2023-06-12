const path = require('path');
const fs = require('fs');
const https = require('https');
const dotenv = require('dotenv');
dotenv.config();

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

exports.downloadBook = (req, res, next) => {
  const bookId = req.params.bookId;
  Book.findById(bookId)
    .then((book) => {
      if (!book) {
        const error = new Error("Book wasn't found!");
        error.statusCode = 404;
        throw error;
      }
      const bookPath = book.bookUrl.split(path.sep).join(path.posix.sep);
      const bookRead = fs.createReadStream(bookPath);
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", "attachment; filename=" + book.title);
      bookRead.pipe(res);
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
}

exports.readBook = (req, res, next) => {
  const bookId = req.params.bookId;
  Book.findById(bookId)
    .then((book) => {
      if (!book) {
        const error = new Error("Book wasn't found!");
        error.statusCode = 404;
        throw error;
      }
      const bookPath = book.bookUrl.split(path.sep).join(path.posix.sep);
      const bookRead = fs.createReadStream(bookPath);
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", "inline; filename=" + book.title);
      bookRead.pipe(res);
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
}

exports.subscribeNewsletter = (req, res, next) => {
  const email = req.body.mail;
  console.log(email);
  const data = {
    members: [{
      email_address: email,
      status: "subscribed",
    }]
  }

  const jsonData = JSON.stringify(data);

  const options = {
    host: 'us14.api.mailchimp.com',
    path: `/3.0/lists/${process.env.LIST_ID}`,
    method: "POST",
    auth: `kitabu:${process.env.API_KEY}`
  }

  const subscribe = https.request(options, function (response) {
    response.on("data", function (data) {
      if (response.statusCode !== 200) {
        console.log("Data not found");
      }
      console.log(JSON.parse(data));
    });
  })

  subscribe.on('error', (e) => {
    console.error(e);
  });

  subscribe.on('timeout', function (e) {
    app.retry_count += 1;
    console.log("TIMEOUT!");
    subscribe.destroy();
  });
  subscribe.on('uncaughtException', function (e) {
    app.retry_count += 1;
    console.log("!!!!");
    subscribe.destroy();
  });

  subscribe.write(jsonData);
  subscribe.end();
}
