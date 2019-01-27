const express = require('express');
const router = express.Router();

const IngredientsController = require('../controllers/ingredients');

router.route('/')
  .get(IngredientsController.listAll)
  .post(IngredientsController.addProduct);

router.route('/:id')
  .put(IngredientsController.updateProduct)
  .delete(IngredientsController.deleteProduct);

module.exports = router;
