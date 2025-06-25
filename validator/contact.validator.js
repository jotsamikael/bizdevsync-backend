const Joi = require('joi');

const CreateContactSchema = Joi.object({
  assignedToUser: Joi.number().required(),
  first_name: Joi.string().required(),
  last_name: Joi.string().required(),
  email: Joi.string().email().allow(null, ''),
  phone: Joi.string().allow(null, ''),
  position: Joi.string().allow(null, ''),
  language: Joi.string().required(),
  notes: Joi.string().allow(null, ''),
  _idLead: Joi.number().required(),
  _idCountry: Joi.number().required()
});

module.exports = { CreateContactSchema };
