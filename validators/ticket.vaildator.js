const joi = require('joi')

const ticketVaildator = joi.object({
    title: joi.string().min(3).max(30).required().messages({
        "any.required": "the title is required",
        "string.min": "the minumim length is 3 chars"
    }),
    description: joi.string().min(3).max(150).required().messages({
        "any.required": "the title is required",
        "string.min": "the minumim length is 3 chars"
    }),
    status: joi.string().valid(
        'opened',
        'assigned',
        'inProgress',
        'resolved',
        'closed'

    ),teamLeader:joi.string().required().messages({
        "any.required":"You Should select team"
    })

})
module.exports = ticketVaildator