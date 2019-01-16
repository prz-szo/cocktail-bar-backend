var express = require('express');
var router = express.Router();


router.post('/', function (req, res) {
  res.json({ message: 'Stworzenie nowego koktajlu' });
});


router.get('/', function(req, res, next) {
  res.json({ message: `Lista wszystkich koktajli with query ${JSON.stringify(req.query)}` });
});

router.get('/:id(\\d+)', function(req, res, next) {
  res.json({ message: `szczegoly koktajlu ${req.params.id}` });
});

router.get('/top10', function(req, res, next) {
  res.json({ message: 'Lista top 10 koktajli' });
});

router.get('/random', function(req, res, next) {
  res.json({ message: 'losowy koktajl' });
});


router.put('/:id(\\d+)', function (req, res) {
  res.json({ message: `Update koktajlu ${req.params.id}` })
});


router.delete('/:id', function (req, res) {
  res.json({ message: 'Usuniecie koktajlu' })
});

module.exports = router;
