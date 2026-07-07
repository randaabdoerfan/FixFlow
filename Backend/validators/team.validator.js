const joi = require('joi');

exports.createTeamSchema = joi.object({
  name: joi.string().required().min(2).max(50),
  managerId: joi.string().hex().length(24).allow('').optional(),
});

exports.updateTeamSchema = joi.object({
  name: joi.string().min(2).max(20),
  managerId: joi.string().hex().length(24),
});