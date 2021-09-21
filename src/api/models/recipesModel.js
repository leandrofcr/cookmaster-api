const { ObjectId } = require('mongodb');
const { getConnection } = require('./connection');

const createRecipe = async (name, ingredients, preparation, userId) => {
  const db = await getConnection();
  const newRecipe = await db.collection('recipes').insertOne({ name, ingredients, preparation });
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

module.exports = {
  createRecipe,
  getAllRecipes,
  findRecipeById,
};