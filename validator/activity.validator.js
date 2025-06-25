const Joi = require('joi');

const CreateActivitySchema = Joi.object({
  title: Joi.string().required(),
  detail: Joi.string().required(),
  start_date:Joi.date().required(),
  due_date:Joi.date().required(),
  tags: Joi.string().required(),
  priority: Joi.string().required(),
  status: Joi.string().optional(),
  last_action: Joi.string().optional(),
  next_action: Joi.string().optional(),
  last_action_date: Joi.date().optional(),
  next_action_date: Joi.date().optional(),
  _idFollowup: Joi.number().optional(),
 _idBusiness:Joi.number().optional()
});

module.exports = { CreateActivitySchema };
