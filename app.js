/******** imports and libraries *******/
const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
const mongoose = require("mongoose");

/******** importing routes *******/
const catalogueRoutes = require("./routes/catalogue");
const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");

/********** initialization **********/
const app = express();

/******** user-defined functions *******/
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "books");
  },
  filename: (req, file, cb) => {
    // let ext = file.originalname.substring(file.originalname.lastIndexOf('.'), file.originalname.length);
    // cb(null, new Date().toISOString().replace(/:/g, ',') + "#-#" + file.originalname);
    cb(null, file.originalname);
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

app.use(multer({ storage: fileStorage, fileFilter: filter }).single("book"));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Expose-Headers", "Content-Disposition");
  next();
});

app.use("/catalogue", catalogueRoutes);
app.use(authRoutes);
app.use("/admin", adminRoutes);

app.use((error, req, res, next) => {
  console.log(error);
  const statusCode = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(statusCode).json({ message: message, data: data, error: error });
});

mongoose
  .connect("mongodb://127.0.0.1:27017/elibrary")
  .then((res) => {
    app.listen(8080, () => {
      console.log("Server started on port 8080");
    });
  })
  .catch((err) => {
    console.log(err);
  });
