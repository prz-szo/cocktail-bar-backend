const express = require('express');
const router = express.Router();

const UserController = require('../controllers/users');

router.route('/')
  .post(UserController.createUser)
  .delete(UserController.deleteUser);

router.post('/login', UserController.login);

module.exports = router;
