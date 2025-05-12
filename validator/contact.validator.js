const Joi = require('joi');

const CreateContactSchema = Joi.object({
  assignedToUser: Joi.number().required(),
  first_name: Joi.string().required(),
  last_name: Joi.string().required(),
  email: Joi.string().email().allow(null, ''),
  phone: Joi.string().allow(null, ''),
  weight: Joi.number().min(0).max(5).allow(null),
  position: Joi.string().allow(null, ''),
  language: Joi.object().required(),
  notes: Joi.string().allow(null, ''),
  Lead_idLead: Joi.number().required(),
  Country_idCountry: Joi.number().required()
});

module.exports = { CreateContactSchema };
