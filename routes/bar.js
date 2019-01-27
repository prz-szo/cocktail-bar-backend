const express = require('express');
const router = express.Router();

const BarController = require('../controllers/bar');

router.route('/:userId')
  .get(BarController.listUserBar)
  .post(BarController.addProduct);

router.route('/:userId/ingredients/:ingredientId')
  .delete(BarController.deleteProduct)
  .put(BarController.updateProduct);

module.exports = router;
