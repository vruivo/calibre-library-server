const path = require('path');
const express = require('express');
const router = express.Router();


router.use('/page', express.static(path.join(__dirname, '/public/index.html')));
router.use('/kobo', express.static(path.join(__dirname, '/public/index.html')));
router.use('/js', express.static(path.join(__dirname, '/public/js/')));

router.use('/:library/book/:id$', function (req, res) {
  res.sendFile(path.join(__dirname, '/public/book.html'));
})

router.use('/testpage', function (req, res, next) {
  console.log('-------------- TESTPAGE --------------------');
  console.log(req.headers);
  console.log('--------------------------------------------');
  next();
},
express.static(path.join(__dirname, '/public/testpage.html')));

module.exports = router