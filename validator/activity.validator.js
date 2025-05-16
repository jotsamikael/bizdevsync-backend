const Joi = require('joi');

const CreateActivitySchema = Joi.object({
  action_detail: Joi.string().required(),
  last_action: Joi.string().required(),
  last_action_date: Joi.string().required(),
  next_action: Joi.string().required(),
  idFollowup: Joi.number().required()
});

module.exports = { CreateActivitySchema };
