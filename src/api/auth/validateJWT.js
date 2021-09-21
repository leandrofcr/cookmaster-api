require('dotenv').config();
const jwt = require('jsonwebtoken');
const { StatusCodes: { UNAUTHORIZED, NOT_FOUND } } = require('http-status-codes');
const usersModel = require('../models/usersModel');

const secret = process.env.SECRET || 'notSoSecret';

module.exports = async (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) return res.status(UNAUTHORIZED).json({ message: 'jwt malformed' });
  
  try {
    const decoded = jwt.verify(token, secret);
    const user = await usersModel.findUser(decoded.email);

    if (!user) return res.status(NOT_FOUND).json({ message: 'user not found' });

    req.user = user;
    next();
  } catch (err) {
    console.log(err.message);
    return res.status(UNAUTHORIZED).json({ message: err.message });
  }
};