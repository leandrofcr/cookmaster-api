const { checkLoginEntries, verifyLoginData } = require('../validations/loginValidations');

const checkLogin = async (email, password) => {
  const loginData = checkLoginEntries(email, password);
  if (loginData.message) return { message: loginData.message };

  const user = await verifyLoginData(email, password);
  if (user.message) return { message: user.message };
  
  return user;
};

module.exports = {
  checkLogin,
};