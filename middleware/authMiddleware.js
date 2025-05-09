const jwt = require('jsonwebtoken');
const ENV = require('../config');
const createError = require('../middleware/error');

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.cookies?.access_token || req.headers['authorization'];
  if (!token) {
    return next(createError(401, 'Access denied! No token provided.'));
  }

  try {
    const decoded = jwt.verify(token, ENV.TOKEN);
    req.user = decoded;
    next();
  } catch (err) {
    return next(createError(403, 'Invalid token', err.message));
  }
};

module.exports = verifyToken;
