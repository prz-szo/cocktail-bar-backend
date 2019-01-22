const express = require('express');
const router = express.Router();

const Cocktails = require('../controllers/cocktails');

router.route('/')
  .get(Cocktails.listAllCocktails)
  .post(Cocktails.createCocktail);

router.route('/:id(\\d+)')
  .get(Cocktails.cocktailDetail)
  .put(Cocktails.updateCocktail)
  .delete(Cocktails.deleteCocktail);

router.get('/top10', Cocktails.top10Cocktails);

router.get('/random', Cocktails.randomCocktail);


module.exports = router;
