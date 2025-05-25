const Joi = require('joi');

const CreateBusinessSchema = Joi.object({
  need: Joi.string().required(),
  approach: Joi.string().required(),
  stage: Joi.string().required(),
  approach:Joi.string().required(),
  client_constraints:Joi.string().allow('', null),
  business_type: Joi.string().required(),
  case_level: Joi.string().required(),
  total_turnover: Joi.string().allow('', null),
  potential_time_for_delivery: Joi.string().allow('', null),
  case_started_date: Joi.string().required(),
  current_supplier: Joi.string().allow('', null),
  previous_vc: Joi.string().allow('', null),
  turnover_signable: Joi.string().allow('', null),
  notes: Joi.string().allow('', null),
  closed_date: Joi.date().allow(null),
  Lead_idLead: Joi.number().required()
});

module.exports = { CreateBusinessSchema };
