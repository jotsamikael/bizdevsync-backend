const createError = require('../middleware/error');

const checkSubscription = (req, res, next) => {
  const user = req.user;

  if (!user || !user.will_expire) {
    return next(createError(403, 'No subscription info available.'));
  }

  const now = new Date();

  if (new Date(user.will_expire) < now) {
    return next(createError(403, 'Your subscription has expired.'));
  }

  next();
};

module.exports = checkSubscription;
