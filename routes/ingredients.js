const express = require('express');
const router = express.Router();

const IngredientsController = require('../controllers/ingredients');

router.route('/')
  .get(IngredientsController.listAll)
  .post(IngredientsController.addProduct);

router.route('/:ingredientId')
  .delete(IngredientsController.deleteProduct);

module.exports = router;
