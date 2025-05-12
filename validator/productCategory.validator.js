const Joi = require('joi');

const CreateProductCategorySchema = Joi.object({
  label: Joi.string().required()
});

module.exports = { CreateProductCategorySchema };
