const jwt = require('jsonwebtoken');
const keys = require('../config/keys');
const sendError = require('../utils/sendError');

module.exports = function (req, res, next) {
  const token = req.header('x-auth-token');
  if (!token) return sendError('Access denied. No token provided.', res)
  try {
    const decoded = jwt.verify(token, keys.jwtPrivateKey);
    req.user = decoded;
    next();
  }
  catch (ex) {
    return sendError('Invalid token', res)
  }
}