var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  // res.render('index', { title: 'Express' });
  console.log('GET / 首页路由')
  // res.redirect('/login');
});

module.exports = router;
