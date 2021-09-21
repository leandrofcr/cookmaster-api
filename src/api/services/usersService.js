const { isValidEntries, emailRegistered } = require('../validations/usersValidations');
const usersModel = require('../models/usersModel');

const createUser = async (name, email, password) => {
  const isValidData = isValidEntries(name, email, password);
  if (isValidData.message) return isValidData;
  
  const alreadyRegistered = await emailRegistered(email);
  if (alreadyRegistered.message) return alreadyRegistered;
  
  return usersModel.createUser(name, email, password);
};

module.exports = {
  createUser,
};