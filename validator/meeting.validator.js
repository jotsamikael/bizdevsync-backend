const Joi = require('joi');

const CreateMeetingSchema = Joi.object({
  title:Joi.string().required(),
  date: Joi.string().required(),
  summary: Joi.string().optional(),
  next_action: Joi.string().required(),
  next_action_date: Joi.string().required(),
  due_date:Joi.string().required(),
  Followup_idFollowup: Joi.number().optional(),
  Business_idBusiness:Joi.number().optional()

});

module.exports = { CreateMeetingSchema };
