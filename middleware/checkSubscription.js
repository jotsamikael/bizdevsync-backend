const createError = require('../middleware/error');
const logger = require('../controller/utils/logger.utils')

const checkSubscription = (req, res, next) => {
  const user = req.user;

  if (!user || !user.will_expire) {
    return next(createError(403, 'No subscription info available.'));
  }

  const now = new Date();

  if (new Date(user.will_expire) < now) {
    logger.info(`Subcription of user ${user.email} expired`)
    return next(createError(403, 'Your subscription has expired.'));
  }

  next();
};

module.exports = checkSubscription;
