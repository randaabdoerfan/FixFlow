const Joi=require('joi');
const messageValidator=Joi.object({
    sender:Joi.string().required().message("Sender ID is required"),
    receiver:Joi.string().required().message("Receiver ID is required"),
    // ticket_id:Joi.string().required().message("Ticket ID is required"),
    body:Joi.string().required().message("Content is required")
});
module.exports = messageValidator;