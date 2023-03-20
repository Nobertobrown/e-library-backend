const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const bookSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    publisher: {
      type: String,
      required: true,
    },
    isbn: String,
    publishedAt: {
      type: Date,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    rating: {
      type: Object,
      required: true,
    },
    languages: {
      type: Array,
      required: true,
    },
    printLength: {
      type: Number,
      required: true,
    },
    imgUrl: {
      type: String,
      required: true,
    },
    fields: Array,
    tags: {
      type: Array,
      required: true,
    },
    reviews: Array,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Book", bookSchema);
