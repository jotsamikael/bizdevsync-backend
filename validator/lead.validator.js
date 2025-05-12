const Joi = require('joi');

const CreateLeadSchema = Joi.object({
    assignedToUser: Joi.optional(),
    name: Joi.string().required(),
    description: Joi.string().required(),
    logo: Joi.string().optional(),
    country: Joi.number().required(),
    activitySector: Joi.string().required(),
    is_private: Joi.boolean().optional()
});

const UpdateLeadSchema = Joi.object({
    assignedToUser: Joi.optional(),
    name: Joi.string().optional(),
    description: Joi.string().optional(),
    Country_idCountry: Joi.number().optional(),
    activitySector: Joi.string().optional(),
    is_private: Joi.boolean().optional()
});

module.exports = { CreateLeadSchema, UpdateLeadSchema };
