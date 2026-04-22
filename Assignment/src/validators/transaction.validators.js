const Joi = require("joi");

const transferSchema = Joi.object({
  accountId: Joi.string().required(),
  amount: Joi.number().precision(2).positive().max(25000).required(),
  description: Joi.string().max(140).allow(""),
  beneficiaryName: Joi.string().max(140).required(),
  beneficiaryAccount: Joi.string().pattern(/^[0-9]{8,18}$/).required(),
  twoFactorCode: Joi.string().pattern(/^[0-9]{6}$/).optional(),
  biometricAssertion: Joi.string().max(512).optional()
});

module.exports = { transferSchema };
