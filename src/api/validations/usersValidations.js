const { checkExistence } = require('../models/usersModel');

const errors = {
  invalidEntries: 'Invalid entries. Try again.',
  alreadyRegistered: 'Email already registered',
};

const EMAIL_REG = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// reference:  https://stackoverflow.com/questions/46155/how-to-validate-an-email-address-in-javascript

const isValidEntries = (name, email, password) => {
  if (!name || !email || !password) return { message: errors.invalidEntries };
  if (!EMAIL_REG.test(email)) return { message: errors.invalidEntries };

  return {};
};

const emailRegistered = async (email) => {
  const alreadyRegistered = await checkExistence(email);
  if (alreadyRegistered) return { emailConflict: true, message: errors.alreadyRegistered };
  return {};
};

module.exports = {
  isValidEntries,
  emailRegistered,
};
