const { ObjectId } = require('mongodb');

const errors = {
  invalidEntries: 'Invalid entries. Try again.',
};

const checkRecipeEntries = (name, ingred, prep) => {
  if (!name || !ingred || !prep) return { message: errors.invalidEntries };
  return {};
};

const checkId = async (id) => ObjectId.isValid(id);

module.exports = {
  checkRecipeEntries,
  checkId,
};
