const joi = require('joi');

exports.createTeamSchema = joi.object({
  name: joi.string().required().min(2).max(20),
  managerId: joi.string().hex().length(24).required()
    .messages({ 'any.required': 'Manager ID is required' }),
});

exports.updateTeamSchema = joi.object({
  name: joi.string().min(2).max(20),
  managerId: joi.string().hex().length(24),
});