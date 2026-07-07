const Joi = require("joi");

const userValidator = Joi.object({
    name: Joi.string()
        .min(3)
        .max(30)
        .required()
        .messages({
            "any.required": "Name is required",
            "string.empty": "Name is required",
            "string.min": "Name must be at least 3 characters",
            "string.max": "Name must not exceed 30 characters"
        }),

    email: Joi.string()
        .email()
        .pattern(/^[a-zA-Z0-9._%+-]+@gmail\.com$/)
        .required()
        .messages({
            "string.email": "Please provide a valid email",
            "string.pattern.base": "Please provide a valid Gmail address",
            "any.required": "Email is required"
        }),

    password: Joi.string()
        .min(8)
        .max(30)
        .required()
        .messages({
            "any.required": "Password is required",
            "string.min": "Password must be at least 8 characters"
        }),

    confirmPassword: Joi.any()
        .valid(Joi.ref("password"))
        .required()
        .messages({
            "any.only": "Passwords do not match",
            "any.required": "Confirm password is required"
        }),

    phone: Joi.string()
        .pattern(/^(01)[0-2,5]{1}[0-9]{8}$/)
        .allow("", null)
        .messages({
            "string.pattern.base": "Please provide a valid phone number"
        }),

    role: Joi.string()
        .valid("admin", "manager", "agent", "user")
        .optional(),

    team: Joi.string().optional(),

    managerId: Joi.string().optional(),

    avatar: Joi.string().optional()
});

module.exports = userValidator;