const { ObjectId } = require('mongodb');
const { getConnection } = require('./connection');

const createRecipe = async (name, ingredients, preparation, userId) => {
  const db = await getConnection();
  const newRecipe = await db.collection('recipes').insertOne(
    { name, ingredients, preparation, userId },
  );
  return { recipe: { ...newRecipe.ops[0], userId } };
};

const getAllRecipes = async () => {
  const db = await getConnection();
  return db.collection('recipes').find().toArray();
};

const findRecipeById = async (id) => {
  const db = await getConnection();
  return db.collection('recipes').findOne({ _id: ObjectId(id) });
};

const editRecipe = async ([name, ingredients, preparation, recipeId], [userId, role]) => {
  const db = await getConnection();
  const recipe = await findRecipeById(recipeId);
  
// recipe can only be updated if it belongs to the logged in user or if that user is an administrator.
  if (role === 'admin' || recipe.userId.toString() === userId.toString()) { 
    const updatedRecipe = await db.collection('recipes').findOneAndUpdate(
      { _id: ObjectId(recipeId) },
      { $set: { name, ingredients, preparation } },
      { returnOriginal: false },
    );
    return { ...updatedRecipe.value, userId };
  }

  return { accessError: true };
};

module.exports = {
  createRecipe,
  getAllRecipes,
  findRecipeById,
  editRecipe,
};