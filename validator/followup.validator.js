const Joi = require('joi');

const CreateFollowupSchema = Joi.object({
  start_date: Joi.string().required(),
  source: Joi.string().required(),
  Lead_idLead: Joi.number().required()
});

module.exports = { CreateFollowupSchema };
