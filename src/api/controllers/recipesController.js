const { 
  StatusCodes: {
    BAD_REQUEST,
    INTERNAL_SERVER_ERROR,
    CREATED,
    OK,
    NOT_FOUND,
} } = require('http-status-codes');

const recipesService = require('../services/recipesService');

const INTERNAL_SERVER_ERROR_MSG = 'Something went wrong :(';

const createRecipe = async (req, res) => {
  try {
    const { name, ingredients, preparation } = req.body;
    const { _id: userId } = req.user;
    const result = await recipesService.createRecipe(name, ingredients, preparation, userId);

    if (result.message) return res.status(BAD_REQUEST).json(result);

    return res.status(CREATED).json(result);
  } catch (err) {
    console.log(err.message);
    return res.status(INTERNAL_SERVER_ERROR).json(INTERNAL_SERVER_ERROR_MSG);
  }
};

const getAllRecipes = async (_req, res) => {
  try {
    const recipes = await recipesService.getAllRecipes();
    
    return res.status(OK).json(recipes);
  } catch (err) {
    console.log(err.message);
    return res.status(INTERNAL_SERVER_ERROR).json(INTERNAL_SERVER_ERROR_MSG);
  }
};

const findRecipeById = async (req, res) => {
  try {
    const { id } = req.params;
    const recipe = await recipesService.findRecipeById(id);

    if (recipe.message) return res.status(NOT_FOUND).json(recipe);

    return res.status(OK).json(recipe);
  } catch (err) {
    console.log(err.message);
    return res.status(INTERNAL_SERVER_ERROR).json(INTERNAL_SERVER_ERROR_MSG);
  }
};

module.exports = {
  createRecipe,
  getAllRecipes,
  findRecipeById,
};