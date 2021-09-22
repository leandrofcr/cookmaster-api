const {
  BAD_REQUEST,
  INTERNAL_SERVER_ERROR,
  CREATED,
  OK,
  NOT_FOUND,
  UNAUTHORIZED,
  NO_CONTENT,
} = require('http-status');

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

const editRecipe = async (req, res) => {
  try {
    const { name, ingredients, preparation } = req.body;
    const { _id: userId, role } = req.user;
    const { id: recipeId } = req.params;
    
    const recipe = await recipesService.editRecipe(
      [name, ingredients, preparation, recipeId],
      [userId, role],
    );
    if (recipe.message) return res.status(UNAUTHORIZED).json(recipe);

    return res.status(OK).json(recipe);
  } catch (err) {
    console.log(err.message);
    return res.status(INTERNAL_SERVER_ERROR).json(INTERNAL_SERVER_ERROR_MSG);
  }
};

const removeRecipe = async (req, res) => {
  try {
    const { id: recipeId } = req.params;
    const { _id: userId, role } = req.user;

    const removedRecipe = await recipesService.removeRecipe(recipeId, userId, role);

    if (removedRecipe.message) return res.status(UNAUTHORIZED).json(removedRecipe);

    return res.status(NO_CONTENT).json();
  } catch (err) {
    console.log(err.message);
    return res.status(INTERNAL_SERVER_ERROR).json(INTERNAL_SERVER_ERROR_MSG);
  }
};

const addImage = async (req, res) => {
  const { path } = req.file;
  const { id: recipeId } = req.params;
  const { _id: userId, role } = req.user;

  const recipe = await recipesService.addImage(recipeId, userId, path, role);
  if (recipe.message) return res.status(UNAUTHORIZED).json(recipe);

  return res.status(OK).json(recipe);
};

module.exports = {
  createRecipe,
  getAllRecipes,
  findRecipeById,
  editRecipe,
  removeRecipe,
  addImage,
};