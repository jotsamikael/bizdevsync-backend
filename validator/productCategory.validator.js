const Joi = require('joi');

const CreateProductCategorySchema = Joi.object({
  label: Joi.string().required(),
  description: Joi.string().optional()

});

module.exports = { CreateProductCategorySchema };
