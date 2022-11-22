var path = require('path');
var express = require('express');
var multer = require('multer')
var moment = require('moment')

var router = express.Router();
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/files/upload')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = moment().format("YYMMDDHHmmss") + '-' + Math.round(Math.random() * 1E4)
    var originalname = Buffer.from(file.originalname, "latin1").toString(
      "utf8"
    );
    file.originalname = originalname.substring(0, originalname.lastIndexOf("."))
    cb(null, file.originalname + '-' + uniqueSuffix + '.xls')
  }
})
var upload = multer({
  storage: storage
})

router.post('/upload', upload.single('file'), (req, res, next) => {
  if(req.file && req.file.mimetype && req.file.mimetype == 'application/vnd.ms-excel') {
    console.log(2, req.file)
    res.send(req.file.fieldname)
  } else {
    res.send('upload failed')
  }
});

router.post('/assess', function(req, res, next) {
  res.send('ccep/assess');
});

module.exports = router;
