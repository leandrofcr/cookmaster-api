const { getConnection } = require('./connection');

const checkLogin = async (email, password) => {
  const db = await getConnection();
  const user = await db.collection('users').findOne({ email });
  if (!user || user.password !== password) return { loginError: true };

  return user;
};

module.exports = {
  checkLogin,
};