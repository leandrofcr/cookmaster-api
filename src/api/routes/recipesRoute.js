const express = require('express');
const { createRecipe, getAllRecipes } = require('../controllers/recipesController');
const validateJWT = require('../auth/validateJWT');

const router = express.Router();

router.route('/')
  .post(
    validateJWT,
    createRecipe,
  )
  .get(getAllRecipes);

  module.exports = router;