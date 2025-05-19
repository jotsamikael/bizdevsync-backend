const Joi = require('joi');

const CreateSourceSchema = Joi.object({
  label: Joi.string().required(),
  description: Joi.string().required(),
  idUser: Joi.number().required()
});

module.exports = { CreateSourceSchema };
