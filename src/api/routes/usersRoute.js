const express = require('express');
const { createUser } = require('../controllers/usersController');

const router = express.Router();

router.route('/')
  .post(createUser);

module.exports = router;