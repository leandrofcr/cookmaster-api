const {
  checkLoginEntries,
  verifyLoginData,
  checkEmailFormat,
} = require('../validations/loginValidations');

const checkLogin = async (email, password) => {
  const loginData = checkLoginEntries(email, password);
  if (loginData.message) return { message: loginData.message };

  const emailFormat = checkEmailFormat(email, password);
  if (emailFormat.message) return { message: emailFormat.message };

  const user = await verifyLoginData(email, password);
  if (user.message) return { message: user.message };
  
  return user;
};

module.exports = {
  checkLogin,
};