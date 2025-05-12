const Joi = require('joi');

const CreateProductSchema = Joi.object({
  label: Joi.string().required(),
  price: Joi.number().precision(2),
  description: Joi.string().allow('', null),
  Enterprise_idEnterprise: Joi.number().required(),
  ProductCategory_idProductCategory: Joi.number().required()
});

module.exports = { CreateProductSchema };
