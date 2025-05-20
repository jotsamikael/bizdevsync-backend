const Joi = require('joi');

const CreateFollowupSchema = Joi.object({
  start_date: Joi.string().required(),
  Lead_idLead: Joi.number().required(),
  outcome: Joi.string().required(),
  notes: Joi.string().required(),
  status: Joi.string().required(),
  priority: Joi.string().required(),

});

module.exports = { CreateFollowupSchema };
