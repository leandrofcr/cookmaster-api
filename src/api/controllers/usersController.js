const { 
  StatusCodes: {
    BAD_REQUEST,
    CREATED,
    CONFLICT,
} } = require('http-status-codes');
const usersService = require('../services/usersService');

const createUser = async (req, res) => {
  const { name, email, password } = req.body;
  const result = await usersService.createUser(name, email, password);

  if (result.emailConflict) return res.status(CONFLICT).json({ message: result.message });
  if (result.message) return res.status(BAD_REQUEST).json(result);

  return res.status(CREATED).json(result);
};

module.exports = {
  createUser,
};