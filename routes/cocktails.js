var express = require('express');
var router = express.Router();

// CREATE
router.post('/', function (req, res) {
  res.json({ message: 'Stworzenie nowego koktajlu' });
});


// READ
router.get('/', function(req, res) {
  res.json({ message: `Lista wszystkich koktajli with query ${JSON.stringify(req.query)}` });
});

router.get('/:id(\\d+)', function(req, res) {
  res.json({ message: `szczegoly koktajlu ${req.params.id}` });
});

router.get('/top10', function(req, res) {
  res.json({ message: 'Lista top 10 koktajli' });
});

router.get('/random', function(req, res) {
  res.json({ message: 'losowy koktajl' });
});


// UPDATE
router.put('/:id(\\d+)', function (req, res) {
  res.json({ message: `Update koktajlu ${req.params.id}` })
});


// DELETE
router.delete('/:id', function (req, res) {
  res.json({ message: 'Usuniecie koktajlu' })
});

module.exports = router;
