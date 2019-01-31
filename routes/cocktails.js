const express = require('express');
const router = express.Router();

const CocktailsController = require('../controllers/cocktails');
const Auth = require('../utils/Auth');

router.route('/')
  .get(CocktailsController.listAllCocktails)
  .post(CocktailsController.createCocktail);

router.route('/:id(\\d+)')
  .get(CocktailsController.cocktailDetail)
  .put(CocktailsController.updateCocktail)
  .delete(CocktailsController.deleteCocktail);

router.get('/top10', CocktailsController.top10Cocktails);

router.get('/random', CocktailsController.randomCocktail);


module.exports = router;
