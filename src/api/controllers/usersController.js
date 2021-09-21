const { BAD_REQUEST, CREATED, CONFLICT, INTERNAL_SERVER_ERROR } = require('http-status');

const usersService = require('../services/usersService');

const INTERNAL_SERVER_ERROR_MSG = 'Something went wrong :(';

const createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const result = await usersService.createUser(name, email, password);
  
    if (result.emailConflict) return res.status(CONFLICT).json({ message: result.message });
    if (result.message) return res.status(BAD_REQUEST).json(result);
  
    return res.status(CREATED).json(result);
  } catch (error) {
    console.log(error.message);
    return res.status(INTERNAL_SERVER_ERROR).send(INTERNAL_SERVER_ERROR_MSG);
  }
};

module.exports = {
  createUser,
};