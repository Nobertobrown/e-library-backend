exports.getBooks = (req, res, next) => {
  res.status(200).json({
    books: [
      {
        _id: "1",
        title: "Engineering Mathematics",
        author: "John Bird",
        rating: "6",
        cover: "/images/john-math.png",
        fields: ["coe", "ete", "me", "ee", "ce"],
      },
    ],
  });
};

exports.postBook = (req, res, next) => {
  const title = req.body.title;
  const author = req.body.author;
  const desc = req.body.description;
  // const tags = [];
  const book = req.files;
  const rating = req.body.rating;
  // const bookUrl = book.url;

  //  An example of how a book would be saved on the database
  //  {
  //   "title": "To Kill a Mockingbird",
  //   "author": "Harper Lee",
  //   "publisher": "J. B. Lippincott & Co.",
  //   "isbn": "978-0446310789",
  //   "published_date": "July 11, 1960",
  //   "description": "To Kill a Mockingbird is a novel by Harper Lee published in 1960. It was immediately successful, winning the Pulitzer Prize, and has become a classic of modern American literature.",
  //   "cover_image": "https://example.com/book-cover.jpg",
  //   "reviews": [
  //     {
  //       "user": "John Smith",
  //       "rating": 4,
  //       "comment": "Great book, highly recommended!"
  //     },
  //     {
  //       "user": "Jane Doe",
  //       "rating": 5,
  //       "comment": "One of the best books I've ever read."
  //     }
  //   ]
  // }
  console.log(book);

  // create item in db
  res.status(201).json({
    message: "Item created!",
    book: { _id: new Date().toISOString(), title: title, author: author },
  });
};
