var express = require('express');
var router = express.Router();


router.get('/', function(req, res, next) {
  res.send('Lista wszystkich skladnikow');
});

router.get('/:id', function(req, res, next) {
  res.send('Szczegoly skladniku');
});


router.post('/', function (req, res) {
  res.send('Stworzenie nowego skladnika')
});


router.delete('/:id', function (req, res) {
  res.send('Usuniecie skladnika')
});

module.exports = router;
