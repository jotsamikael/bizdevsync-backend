const Joi = require('joi');

const CreateProductSchema = Joi.object({
  label: Joi.string().required(),
  price: Joi.number().precision(2),
  description: Joi.string().allow('', null),
  product_category_id: Joi.number().required()
});

module.exports = { CreateProductSchema };
