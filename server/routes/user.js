var express = require('express');
var router = express.Router();

var UsrTbl = require('../db/usr')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/login', function(req, res, next) {
  let account = req.body.account;
  let pwd = md5(req.body.pwd)
  console.log('/login', account, pwd)
  UsrTbl.queryByID({
    usr_account: account,
    usr_pwd: pwd
  }, (results) => {
    req.session.token = 'CQCDI';
    res.send({
      usrList: Object.values(results)
    })
  })
});

router.post('/logout', function(req, res, next) {
  delete req.session.token
  res.send('logout');
});

router.post('/query_usr', function(req, res, next) {
  console.log('query_usr');
  UsrTbl.queryByPage({
    pageNo: req.body.pageNo,
    pageSize: req.body.pageNum
  }, (results, conn) => {
    // conn.end();
    res.send({
      usrList: Object.values(results)
    });
  });
});


module.exports = router;
