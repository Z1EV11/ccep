var express = require('express');
var router = express.Router();

router.post('/upload', function(req, res, next) {
  console.log(1);
});

router.post('/assess', function(req, res, next) {
  res.send('ccep/assess');
});

module.exports = router;
