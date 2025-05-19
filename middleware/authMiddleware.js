const jwt = require('jsonwebtoken');
const ENV = require('../config');
const createError = require('../middleware/error');

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  let token = req.cookies?.access_token || req.headers['authorization'];

  if (!token) {
    return next(createError(401, 'Access denied! No token provided.'));
  }
   // Remove 'Bearer ' prefix if present
  if (token.startsWith('Bearer ')) {
    token = token.slice(7); // Remove 'Bearer ' (length = 7)
  }

  try {
    const decoded = jwt.verify(token, ENV.TOKEN);
    req.user = decoded;
    console.log(decoded)
    next();
  } catch (err) {
        console.log(err)
    return next(createError(403, 'Invalid token', err.message));
  }
};

module.exports = verifyToken;
