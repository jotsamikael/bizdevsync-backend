// validators/userValidator.js
const Joi = require('joi');

const registerSchema = Joi.object({
    first_name: Joi.string().required(),
    last_name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    avatar: Joi.string(),
    role:Joi.string().valid('solo_biz_dev', 'enterprise_admin'),
});

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  });
  

  const staffUpdateUserSchema = Joi.object({
  first_name: Joi.string().optional(),
  last_name: Joi.string().optional(),
  email: Joi.string().email().optional(),  // ✅ optional and must be a valid email ONLY if provided
  is_activated: Joi.boolean().optional(),
});


 const userUpdateProfileSchema = Joi.object({
  first_name: Joi.string().optional(),
  last_name: Joi.string().optional(),
  email: Joi.string().email().optional(),  // ✅ optional and must be a valid email ONLY if provided
  telephone: Joi.string().optional(),
  linkedIn: Joi.string().optional(),
  email_signature: Joi.string().optional(),

});


const updatePasswordSchema = Joi.object({
  old_password: Joi.string().required(),
  new_password: Joi.string().min(6).required(),
  confirm_password: Joi.string().valid(Joi.ref('new_password')).required().messages({
    'any.only': 'Confirm password must match new password'
  })
});

module.exports = {  };


module.exports = { registerSchema, loginSchema, staffUpdateUserSchema,userUpdateProfileSchema, updatePasswordSchema };
