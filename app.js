/******** imports and libraries *******/
const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
const mongoose = require("mongoose");

/******** importing routes *******/
const catalogueRoutes = require("./routes/catalogue");

/********** initialization **********/
const app = express();

/******** user-defined functions *******/
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const destPath = path.join(__dirname, "books");
    cb(null, destPath);
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + "-" + file.originalname);
  },
});

const filter = (req, file, cb) => {
  if (
    file.mimetype === "application/pdf" ||
    file.mimetype === "application/msword" ||
    file.mimetype ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

/******** defining middlewares *******/
app.use(bodyParser.json());
app.use("/images", express.static(path.join(__dirname, "images")));

app.use(
  multer({ storage: fileStorage, fileFilter: filter }).fields([
    { name: "book", maxCount: 1 },
  ])
);

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use("/catalogue", catalogueRoutes);

mongoose
  .connect("mongodb://127.0.0.1:27017/library")
  .then((res) => {
    app.listen(8080, () => {
      console.log("Server started on port 8080");
    });
  })
  .catch((err) => {
    console.log(err);
  });
