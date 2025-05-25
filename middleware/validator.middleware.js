
const logger = require('../controller/utils/logger.utils')

// middleware/validate.js
const validate = (schema) => {
    return (req, res, next) => {
      const { error } = schema.validate(req.body);
      if (error) {
          logger.error(`Validation error ${error.details[0].message}`);
        return res.status(400).json({ message: error.details[0].message });
      }
      next();
    };
  };
  
  module.exports = validate;
  