const { validationResult } = require("express-validator");
const Book = require("../models/book");
const fileHelper = require("../util/file");
const mailchimp = require("@mailchimp/mailchimp_marketing");
const dotenv = require('dotenv');
dotenv.config();

mailchimp.setConfig({
  apiKey: process.env.API_KEY,
  server: "us14",
});

const createNewsletter = async () => {
  const response = await mailchimp.campaigns.create({
    type: "regular",
    recipients: {
      list_id: process.env.LIST_ID
    },
    settings: {
      subject_line: "Updates from Kitabu",
      preview_text: "See new books in your favorite online library!",
      title: "Kitabu",
      from_name: "kitabu@gmail.com",
      reply_to: "nobertobrown@gmail.com",
      to_name: "user1",
      auto_footer: true,
      template_id: 10030406
    }
  });

  return response;
};

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
  const printLength = "500";
  const coverUrl = "images/os.png";

  const book = new Book({
    title: title,
    author: author,
    publisher: publisher,
    isbn: isbn,
    publishedAt: publishedAt,
    description: desc,
    rating: rating,
    languages: languages,
    printLength: printLength,
    coverUrl: coverUrl,
    bookUrl: bookUrl,
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

exports.deleteBook = (req, res, next) => {
  const bookId = req.body.bookId;

  Book.findById(bookId)
    .then((book) => {
      if (!book) {
        const error = new Error("Book wasn't found!");
        error.statusCode = 404;
        throw error;
      }
      fileHelper.deleteFile(book.coverUrl);
      fileHelper.deleteFile(book.bookUrl);
      return Book.findByIdAndDelete(bookId);
    })
    .then((result) => {
      console.log("Book Deleted!")
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.sendNewsletter = (req, res, next) => {
  createNewsletter()
    .then((result) => {
      return mailchimp.campaigns.send(result.id)
    })
    .then((result) => {
      console.log(result);
      res.status(200).json({
        message: "Email Sent!"
      })
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
}