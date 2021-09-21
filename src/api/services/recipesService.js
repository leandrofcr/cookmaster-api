const { checkRecipeEntries, checkId } = require('../validations/recipesValidations');
const recipesModel = require('../models/recipesModel');

const errors = {
  notFound: 'recipe not found',
};

const createRecipe = async (name, ingred, prep, userId) => {
  const recipeEntries = checkRecipeEntries(name, ingred, prep);
  if (recipeEntries.message) return recipeEntries;

  return recipesModel.createRecipe(name, ingred, prep, userId);
};

const getAllRecipes = async () => recipesModel.getAllRecipes();

const findRecipeById = async (id) => {
  const isValidId = await checkId(id);
  if (!isValidId) return { message: errors.notFound };

  const recipe = await recipesModel.findRecipeById(id);
  if (!recipe) return { message: errors.notFound };
  
  return recipe;
};

module.exports = {
  createRecipe,
  getAllRecipes,
  findRecipeById,
};