const Joi = require('joi');

const CreateActivitySchema = Joi.object({
  title: Joi.string().required(),
  detail: Joi.string().required(),
  created_date: Joi.date().required(),
  start_date:Joi.date().required(),
  end_date:Joi.date().required(),
  tags: Joi.string().required(),
  priority: Joi.string().required(),
  last_action: Joi.string().required(),
  next_action: Joi.string().required(),
  last_action_date: Joi.date().required(),
  next_action_date: Joi.date().required(),
  Followup_idFollowup: Joi.number().optional()

});

module.exports = { CreateActivitySchema };
