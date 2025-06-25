const Joi = require('joi');

const CreateLeadSchema = Joi.object({
    assigned_to_user_id: Joi.optional(),
    name: Joi.string().required(),
    status: Joi.string().required(),
    description: Joi.string().required(),
    website: Joi.string().optional(),
    email: Joi.string().email().optional(),
    telephone:Joi.string().optional(),
    address: Joi.string().optional(),
    town: Joi.string().optional(),
    tags: Joi.string().optional(),
    country: Joi.number().required(),
    activitySector: Joi.string().required(),
    is_private: Joi.boolean().optional(),
    source: Joi.number().required(),
    lead_value: Joi.number().required(),
});

const UpdateLeadSchema = Joi.object({
    assigned_to_user_id: Joi.optional(),
    name: Joi.string().optional(),
    status: Joi.string().optional(),
    description: Joi.string().optional(),
    website: Joi.string().optional(),
    email: Joi.string().optional(),
    telephone:Joi.string().optional(),
    address: Joi.string().optional(),
    town: Joi.string().optional(),
    tags: Joi.string().optional(),
    country: Joi.number().optional(),
    activitySector: Joi.string().optional(),
    is_private: Joi.boolean().optional(),
    source: Joi.number().optional(),
    lead_value: Joi.number().required(),
    date_converted: Joi.optional()


});

module.exports = { CreateLeadSchema, UpdateLeadSchema };
