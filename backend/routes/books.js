const express = require('express');
const router = express.Router();
const book_queries = require('../database/books');


// middleware that is specific to this router
// router.use(function timeLog (req, res, next) {
//   console.log('Time: ', Date.now())
//   next()
// })

router.get('/books', function (req, res) {
  if ( Object.keys(req.query).length === 0 ) {
    res.send(book_queries.getAllBooks(req.db.database));
  }
  else {
    if (req.query.title)
      res.send(book_queries.getBooksWithTitle(req.db.database, req.query.title));
    else
      res.send();
  }
})

router.get('/books/:id', function (req, res) {
  res.send(book_queries.getBookWithId(req.db.database, req.params.id));
})


module.exports = router