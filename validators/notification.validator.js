const Joi = require('joi');
const notificationValidator = Joi.object({
    user: Joi.string().required().message("User ID is required"),
    message: Joi.string().required().message("Message ID is required"),
    is_seen: Joi.boolean().message("is_seen must be a boolean")
});
module.exports = notificationValidator;