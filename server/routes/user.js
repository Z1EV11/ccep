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
    res.status(500).send({
      msg: '验证码错误'
    })
    next()
  } else {
      try {
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
      } catch(err) {
        res.send({
          msg: '账号密码错误'
        })
      }
  }
});

router.post('/logout', function(req, res, next) {
  if (req.session.token === req.body.account) {
    delete req.session.token
    res.send({
      msg: '登出成功'
    });
  } else {
    res.status(500).send({
      msg: '登出失败'
    });
  }
});

router.post('/query_usr_info', function(req, res, next) {
  console.log('query_usr_info');
  const account = req.body.account;
  if(req.session.token !== account) {
    res.status(500).send({
      msg: '请重新登录'
    })
  } else {
    UsrTbl.queryByID({
      usr_account: account
    }, (results, conn) => {
      // conn.end();
      res.send({
        usrList: Object.values(results)
      });
    });
  }
});

router.post('/query_usr', function(req, res, next) {
  const account = req.body.id;
  if(req.session.token !== account) {
    res.status(500).send({
      msg: '请重新登录'
    })
  } else {
    UsrTbl.queryByPage({
      usr_account: account,
      pageNo: req.body.pageNo,
      pageSize: req.body.pageNum
    }, (results, conn) => {
      // conn.end();
      res.send({
        usrList: Object.values(results),
        msg: '用户信息查询成功'
      });
    });
  }
});

router.post('/add_usr', function(req, res, next) {
  const account = req.body.tk;
  if(req.session.token !== account) {
    res.status(500).send({
      msg: '违规请求'
    })
  } else {
    UsrTbl.addUsr({
      usr_account: req.body.usrAccount,
      usr_pwd: req.body.usrPwd,
      usr_name: req.body.usrName,
      role_id: req.body.usrRole,
      usr_tel: req.body.usrTel
    }, (results, conn) => {
      // conn.end();
      res.send({
        usrList: Object.values(results),
        msg: '用户添加成功'
      });
    });
  }
});

router.post('/del_usr', function(req, res, next) {
  const account = req.body.tk;
  if(req.session.token !== account) {
    res.status(500).send({
      msg: '违规请求'
    })
  } else {
    UsrTbl.delUsr({
      usr_account: req.body.usrAccount,
    }, (results, conn) => {
      // conn.end();
      res.send({
        usrList: Object.values(results),
        msg: '用户删除成功'
      });
    });
  }
});


module.exports = router;
