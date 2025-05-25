const Joi = require('joi');

const CreateCompetitorSchema = Joi.object({
  name: Joi.string().required(),
  sector: Joi.string().required(),
  headquater_location:Joi.string().required(),
  reference_clients:Joi.string().required(),
  product_line:Joi.string().required(),
  website: Joi.string().allow('', null),
  notes: Joi.string().allow('', null)
});

module.exports = { CreateCompetitorSchema };
