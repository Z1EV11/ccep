var path = require('path');
var fs = require("fs")
var express = require('express');
var multer = require('multer')
var moment = require('moment')
var xlsx = require("node-xlsx")

var readCCEPXlsx = require('../utils/office')
var generateCCEPDocx = require('../utils/office')

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
  storage: storage,
  fileFilter: function(req, file, cb) {
    var originalname = file.originalname;
    console.log(originalname)
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
  上传评估表格
*/
router.post('/upload', upload.single('file'), (req, res, next) => {
  console.log('upload', file);
  if(!req.file || req.file.mimetype || req.file.mimetype !== 'application/vnd.ms-excel') {
    res.send('上传文件有误，请按评估模板格式上传');
  }
  // 读取评估表格
  xlsxData = readCCEPXlsx(file.path)
  // 生成评估报告
  readCCEPXlsx(file.path, xlsxData)
  // 删除评估表格
});

/*
  下载评估报告
*/
router.post('/download', function(req, res, next) {
  res.send('ccep/assess');
});

/*
  下载评估表格模板
*/
router.post('/get_template', function(req, res, next) {
  res.send('ccep/get_template');
});


module.exports = router;
