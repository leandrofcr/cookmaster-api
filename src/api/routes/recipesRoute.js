const express = require('express');
const validateJWT = require('../auth/validateJWT');
const {
  createRecipe,
  getAllRecipes,
  findRecipeById,
  editRecipe,
  removeRecipe,
} = require('../controllers/recipesController');

const router = express.Router();

router.route('/')
  .post(
    validateJWT,
    createRecipe,
  )
  .get(getAllRecipes);

router.route('/:id')
    .get(findRecipeById)
    .put(
      validateJWT,
      editRecipe,
    )
    .delete(
      validateJWT,
      removeRecipe,
    );

  module.exports = router;