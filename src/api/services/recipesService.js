const { checkRecipeEntries } = require('../validations/recipesValidations');
const recipesModel = require('../models/recipesModel');

const createRecipe = async (name, ingred, prep, userId) => {
  const recipeEntries = checkRecipeEntries(name, ingred, prep);
  if (recipeEntries.message) return recipeEntries;

  return recipesModel.createRecipe(name, ingred, prep, userId);
};

const getAllRecipes = async () => recipesModel.getAllRecipes();

module.exports = {
  createRecipe,
  getAllRecipes,
};