const createError = require('./error');

/**
 * Middleware to restrict access based on user role
 * @param {string|string[]} roles - Allowed roles (e.g. 'admin' or ['admin', 'operator'])
 */
const requireRole = (roles) => {
  const allowedRoles = Array.isArray(roles) ? roles : [roles];

  return (req, res, next) => {
    const user = req.user;
    if (!user || !user.role) {
      return next(createError(401, 'Unauthorized: No user or role found'));
    }

    if (!allowedRoles.includes(user.role)) {
     console.log('user role is: '+user.role)
      //console.log(allowedRoles)
      return next(createError(403, 'Forbidden: You do not have access to this resource'));
    }

    next(); // ✅ Role is allowed, continue
  };
};

module.exports = requireRole;
