const errors = {
  invalidEntries: 'Invalid entries. Try again.',
};

const checkRecipeEntries = (name, ingred, prep) => {
  if (!name || !ingred || !prep) return { message: errors.invalidEntries };
  return {};
};

module.exports = {
  checkRecipeEntries,
};
