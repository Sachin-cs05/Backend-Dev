const Joi = require("joi");

const profileUpdateSchema = Joi.object({
  fullName: Joi.string().max(100).required(),
  address: Joi.string().max(140).required(),
  phone: Joi.string().max(20).required(),
  marketingConsent: Joi.boolean().required()
});

module.exports = { profileUpdateSchema };
