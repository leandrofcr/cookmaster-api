const { getConnection } = require('./connection');

const checkExistence = async (email) => {
  const db = await getConnection();
  const wasFound = await db.collection('users').findOne({ email });
  return wasFound !== null;
};

const createUser = async (name, email, password, role) => {
  const db = await getConnection();
  const createdUser = await db.collection('users').insertOne(
    { name, email, password, role: 'user' },
  );
  
  return { user: { _id: createdUser.insertedId, name, email, role: role || 'user' } };
};

const findUser = async (email) => {
  const db = await getConnection();
   return db.collection('users').findOne({ email });
};

module.exports = {
  checkExistence,
  createUser,
  findUser,
};