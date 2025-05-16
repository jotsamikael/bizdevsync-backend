const Joi = require('joi');

const CreateCompetitorSchema = Joi.object({
  website: Joi.string().uri().allow('', null),
  notes: Joi.string().allow('', null)
});

module.exports = { CreateCompetitorSchema };
