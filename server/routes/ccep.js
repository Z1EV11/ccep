const path = require('path');
const fs = require('fs');

var express = require('express');
var multer = require('multer')
var moment = require('moment')

var office = require('../utils/office')
var PrjTbl = require('../db/prj')

var router = express.Router();
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/files/eval_upload');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = moment().format("YYMMDDHHmmss") + Math.round(Math.random() * 1E4)
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
  download the template of evaluation excel
*/
router.get('/get_eval_template', function(req, res, next) {
  res.download('./public/files/template/EVAL_template_221121.xls'); // [***] config
});

/*
  upload evaluation excel
*/
router.post('/eval_upload', upload.single('file'), (req, res, next) => {
  console.log('upload', req.file);
  let outputFile = req.file.filename.substring(0, req.file.filename.lastIndexOf("."))
  outputFile = `${outputFile}.docx`
  // let outputPath = path.join(rootDir, 'public/files/eval_rpt', `${outputFile}.docx`);
  // evalData = office.readEvalXlsx(inputPath, req.body);
  // office.generateRptDocx(templatePath, outputPath, evalData);
  res.send({
    status: 200,
    data: {
      inputFile: req.file.filename,
      outputFile
    },
    msg: '上传成功'
  })
  // res.download(outputPath);
  // fs.unlink(inputPath);
  // fs.unlink(outputPath);
});

router.post('/add_prj', function(req, res, next) {
  const rootDir = req.app.get('rootDir');
  let inputPath = path.join(rootDir, 'public/files/eval_upload/', req.body.inputFile); 
  let templatePath = path.join(rootDir, 'public/files/template/RPT_template_221121.docx'); // [***] config
  let outputPath = path.join(rootDir, 'public/files/eval_rpt', `${req.body.outputFile}`);
  let evalData = office.readEvalXlsx(inputPath, req.body);
  office.generateRptDocx(templatePath, outputPath, evalData);
  // 数据库存项目信息
  PrjTbl.addPrj({
    prj_id: req.body.prjID,
    prj_name: req.body.prjName,
    eval_method: req.body.evalMehod,
    prj_client: req.body.prjClient,
    eval_time: moment().format("YYYY-MM-DD-HH:mm:ss"),
    eval_expert: req.body.evalExpert,
    eval_file: req.body.inputFile,
    rpt_file: req.body.outputFile
  }, (results) => {
    res.send({
      status: 200
    })
  });

});

/*
  delete evaluation project
*/
router.post('/del_prj', function(req, res, next) {
  PrjTbl.delPrj({
    prj_id: req.body.prjID
  }, (results) => {
    res.send({
      status: 200
    });
  });
});

/*
  query evaluation project
*/
router.post('/query_prj', function(req, res, next) {
  // 1.取请求参数 2.用当前页号和单页数量去查询项目信息 3.返回查询结果
  const account = req.body.userID;
  if(req.session.token !== account) {
    res.status(500).send({
      msg: '请重新登录'
    })
  } else {
    PrjTbl.queryByPage({
      user_account: account,
      pageNo: req.body.pageNo,
      pageSize: req.body.pageNum
    }, (results, conn) => {
      // conn.end();
      res.send({
        prjList: Object.values(results)
      });
    });
  }
});

/*
  query details of evaluation project
*/
router.post('/detail_prj', function(req, res, next) {
  PrjTbl.queryByID({
    prj_id: req.body.prjID
  }, (results) => {
    res.send({
      prjList: Object.values(results)
    });
  });
});

/*
  download upload evaluation
*/
router.get('/get_eval_upload', function(req, res, next) {
  const rootDir = req.app.get('rootDir');
  // filePath = path.join('./public/files/eval_rpt', req.query.fileName)
  filePath = `./public/files/eval_upload/${req.query.fileName}`;
  res.download(filePath);
});

/*
  download eval report
*/
router.get('/get_eval_rpt', function(req, res, next) {
  const rootDir = req.app.get('rootDir');
  // filePath = path.join('./public/files/eval_rpt', req.query.fileName)
  filePath = `./public/files/eval_rpt/${req.query.fileName}`;
  res.download(filePath);
});

module.exports = router;