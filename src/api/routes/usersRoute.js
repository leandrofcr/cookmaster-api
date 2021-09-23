const express = require('express');
const validateJWT = require('../auth/validateJWT');
const { createUser, addAdmin } = require('../controllers/usersController');

const router = express.Router();

router.route('/')
  .post(createUser);

router.route('/admin')
  .post(
    validateJWT,
    addAdmin,
  );
module.exports = router;