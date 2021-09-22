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

const removeRecipe = async (recipeId, userId, role) => {
  const db = await getConnection();
  const recipe = await findRecipeById(recipeId);

  if (role === 'admin' || recipe.userId.toString() === userId.toString()) { 
    await db.collection('recipes').findOneAndDelete({ _id: ObjectId(recipeId) });
  }
  return { accessError: true };
};

const addImage = async (recipeId, userId, path, role) => {
  const db = await getConnection();
  const recipe = await findRecipeById(recipeId);

  if (role === 'admin' || recipe.userId.toString() === userId.toString()) { 
    const rcpWithImage = await db.collection('recipes').findOneAndUpdate(
      { _id: ObjectId(recipeId) },
      { $set: { image: `localhost:3000/${path}` } },
      { returnOriginal: false },
    );
    return rcpWithImage.value;
  }

  return { accessError: true };
};

module.exports = {
  createRecipe,
  getAllRecipes,
  findRecipeById,
  editRecipe,
  removeRecipe,
  addImage,
};