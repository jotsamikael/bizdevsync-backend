const Joi = require('joi');

const CreateMeetingSchema = Joi.object({
  date: Joi.string().required(),
  summary: Joi.string().required(),
  next_action: Joi.string().required(),
  idFollowup: Joi.number().required()
});

module.exports = { CreateMeetingSchema };
