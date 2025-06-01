const Joi = require('joi');

const CreateCountrySchema = Joi.object({
  short_name: Joi.string().max(100).required(),
  long_name: Joi.string().max(200).required(),
  iso2: Joi.string().length(2).uppercase().optional().allow(null, ''),
  iso3: Joi.string().length(3).uppercase().optional().allow(null, ''),
  calling_code: Joi.string().pattern(/^\+?[0-9]+$/).optional().allow(null, ''),
  is_un_member: Joi.boolean().required()
});

module.exports = { CreateCountrySchema };

