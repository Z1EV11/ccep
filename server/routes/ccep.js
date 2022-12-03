const path = require('path');
const fs = require('fs');

var express = require('express');
var multer = require('multer')
var moment = require('moment')

var office = require('../utils/office')

var router = express.Router();
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/files/upload');
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
  storage: storage,
  fileFilter: function(req, file, cb) {
    var originalname = file.originalname;
    var suffix = originalname.substring(originalname.lastIndexOf("."), originalname.length)
    var suffixList = ['.xls', '.xlsx']
    if(suffixList.indexOf(suffix) > -1) {
      cb(null, true)
    } else {
      // cb(null, false)
      cb(new Error('上传文件格式错误!'))
    }
  }
})

/*
  download the Evaluation Sheet template
*/
router.get('/get_eval_template', function(req, res, next) {
  res.download('./public/files/template/EVAL_template_221121.xls'); // [***] config
});

/*
  upload Evaluation Sheet
*/
router.post('/upload', upload.single('file'), (req, res, next) => {
  console.log('upload', req.file);
  if(!req.file || !req.file.mimetype || req.file.mimetype !== 'application/vnd.ms-excel') {
    res.send('上传文件有误，请按评估模板格式上传');
  }
  var rootDir = req.app.get('rootDir');
  var inputPath = path.join(rootDir, 'public/files/upload/',req.file.filename); 
  data = office.readCCEPXlsx(inputPath);
  var templatePath = path.join(rootDir, 'public/files/template/RPT_template_221121.docx'); // [***] config
  outputFile = req.file.filename.substring(0, req.file.filename.lastIndexOf("."))
  var outputPath = path.join(rootDir, 'public/files/eval_rpt', `${outputFile}.docx`);
  console.log('templatePath', templatePath);
  console.log('outputPath', outputPath);
  office.generateCCEPDocx(templatePath, outputPath, data);
  res.download(outputPath);
  // fs.unlink(inputPath);
  // fs.unlink(outputPath);
});

router.post('/', function(req, res, next) {
  res.send('ccep');
});

module.exports = router;