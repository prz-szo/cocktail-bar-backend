var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.send('Geta nie obslugujemy');
});


router.post('/', function(req, res, next) {
  res.send('logowanie');
});

module.exports = router;
