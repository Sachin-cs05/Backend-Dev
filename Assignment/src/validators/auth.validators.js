const Joi = require("joi");

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(12).max(128).required()
});

const passwordResetRequestSchema = Joi.object({
  email: Joi.string().email().required()
});

const passwordResetConfirmSchema = Joi.object({
  token: Joi.string().hex().length(64).required(),
  newPassword: Joi.string().min(12).max(128).required()
});

module.exports = {
  loginSchema,
  passwordResetConfirmSchema,
  passwordResetRequestSchema
};
