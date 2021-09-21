const express = require('express');

const router = express.Router();
const {
  createUser,
} = require('../controllers/usersController');

router.route('/')
  .post(createUser);

module.exports = router;