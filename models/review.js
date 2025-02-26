const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const reviewSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    bookId: {
      type: Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
    },
    review: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Review", reviewSchema);
