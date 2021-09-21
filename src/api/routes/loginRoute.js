const express = require('express');
const { checkLogin } = require('../controllers/loginController');

const router = express.Router();

router.route('/')
  .post(checkLogin);

module.exports = router;