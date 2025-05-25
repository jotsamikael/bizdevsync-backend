const Joi = require('joi');

const CreateEnterpriseSchema = Joi.object({
  name: Joi.string().required(),

  logo: Joi.string(),

  slug: Joi.string().alphanum().min(3).max(50).allow('', null),

  sector: Joi.string().valid('Technology', 'Healthcare', 'Education', 'Finance', 'Retail', 'Logistics', 'Manufacturing', 'Media'),

  website: Joi.string().uri().allow('', null),

  email_domain: Joi.string().allow('', null),

  contact_email: Joi.string().email({ tlds: false }).allow('', null),

  country: Joi.number().required(),

  address: Joi.string().required(),

});

module.exports = {
  CreateEnterpriseSchema
};
