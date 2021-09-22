const { checkRecipeEntries, checkId } = require('../validations/recipesValidations');
const recipesModel = require('../models/recipesModel');

const errors = {
  notFound: 'recipe not found',
  accessDenied: 'access denied',
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

const editRecipe = async ([name, ingred, prep, recipeId], [userId, role]) => {
    const recipe = await recipesModel.editRecipe([name, ingred, prep, recipeId], [userId, role]);
    if (recipe.accessError) return { message: errors.accessDenied };
    return recipe;
};

module.exports = {
  createRecipe,
  getAllRecipes,
  findRecipeById,
  editRecipe,
};