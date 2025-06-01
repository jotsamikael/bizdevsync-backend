const createError = require('./error');
const logger = require('../controller/utils/logger.utils')

/**
 * Middleware to restrict access based on user role
 * @param {string|string[]} roles - Allowed roles (e.g. 'admin' or ['admin', 'operator'])
 */
const requireRole = (roles) => {
  const allowedRoles = Array.isArray(roles) ? roles : [roles];

  return (req, res, next) => {
    const user = req.user;
    if (!user || !user.role) {
      logger.info(`User ${user.email} or role ${user.role} not found`)
      return next(createError(401, 'Unauthorized: No user or role found'));
    }

    if (!allowedRoles.includes(user.role)) {
      logger.info(`User ${user.email} tried to access unauthorized resource`)
      return next(createError(403, 'Forbidden: You do not have access to this resource'));
    }

    next(); // ✅ Role is allowed, continue
  };
};

module.exports = requireRole;
