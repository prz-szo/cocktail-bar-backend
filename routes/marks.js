const express = require('express');
const router = express.Router();

const MarksController = require('../controllers/marks');

router.route('/:userId')
  .get(MarksController.userMarks);

router.route('/:userId/cocktail/:cocktailId')
  .put(MarksController.updateMark)
  .post(MarksController.addMark);

module.exports = router;
