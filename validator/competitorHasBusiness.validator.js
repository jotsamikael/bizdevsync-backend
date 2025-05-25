const Joi = require('joi');

const CreateCompetitorHasBusinessSchema = Joi.object({
  market_position: Joi.string().optional(),
  weaknesses: Joi.string().optional(),
  strengths:Joi.string().optional(),
  reference_clients:Joi.string().optional(),
  risk_level:Joi.string().optional()
});

module.exports = { CreateCompetitorHasBusinessSchema };
