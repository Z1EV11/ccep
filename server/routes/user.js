var express = require('express');
var router = express.Router();

var UsrTbl = require('../db/usr')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/login', function(req, res, next) {
  const account = req.body.account;
  let password = req.body.password; // 需要私钥解密
  const captcha = req.body.captcha.toLowerCase();
  // console.log('/login!!!!!!!!!!!!!!', req.session);
  if(captcha !== req.session.captcha) {
    res.send('验证码错误')
    next()
  }
  delete req.session.captcha;
  UsrTbl.queryByPwd({
    usr_account: account,
    usr_pwd: password
  }, (results) => {
    req.session.token = account;
    res.send({
      usrList: Object.values(results)
    })
  })
});

router.post('/logout', function(req, res, next) {
  delete req.session.token
  res.send('logout');
});

router.post('/query_usr_info', function(req, res, next) {
  console.log('query_usr_info');
  const account = req.body.account;
  if(req.session.token !== account) {
    res.status(500).send({
      msg: '请重新登录'
    })
    next()
  }
  // UsrTbl.queryByID({
  //   usr_account: account
  // }, (results, conn) => {
  //   // conn.end();
  //   res.send({
  //     usrList: Object.values(results)
  //   });
  // });
});

router.post('/query_usr', function(req, res, next) {
  console.log('query_usr');
  UsrTbl.queryByPage({
    pageNo: req.body.pageNo,
    pageSize: req.body.pageNum
  }, (results, conn) => {
    // conn.end();
    res.send({
      usrList: Object.values(results),
      msg: '用户信息查询成功'
    });
  });
});


module.exports = router;
