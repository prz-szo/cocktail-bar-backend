const express = require('express');
const router = express.Router();

const Cocktails = require('../controllers/cocktails');

// CREATE
router.post('/', Cocktails.createCocktail);

// READ
router.get('/', Cocktails.listAllCocktails);
router.get('/:id(\\d+)', Cocktails.cocktailDetail);
router.get('/top10', Cocktails.top10Cocktails);
router.get('/random', Cocktails.randomCocktail);

// UPDATE
router.put('/:id(\\d+)', Cocktails.updateCocktail);

// DELETE
router.delete('/:id', Cocktails.deleteCocktail);

module.exports = router;
