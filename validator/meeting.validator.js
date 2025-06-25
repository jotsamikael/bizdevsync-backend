const Joi = require('joi');

const CreateMeetingSchema = Joi.object({
  title:Joi.string().required(),
  status: Joi.string().optional(),
  summary: Joi.string().allow('').optional(),
  next_action: Joi.string().required(),
  next_action_date: Joi.string().required(),
  due_date:Joi.string().required(),
  _idFollowup: Joi.number().optional(),
  _idBusiness:Joi.number().optional(),
 contact_emails: Joi.string().required()
});

module.exports = { CreateMeetingSchema };
