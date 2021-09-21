const usersService = require('../services/usersService');

const createUser = async (req, res) => {
  const { name, email, password } = req.body;
  const result = usersService.createUser(name, email, password);

  if (result.err) return res.status(400).json(result);

  return res.status(201).json(result);
};

module.exports = {
  createUser,
};