const messageRepo = require('../repositories/message.repo');
const notificationService = require("./notification.service");

const appError = require('../utilities/appError')

const sendMessage = async (data) => {
    
    const message= await messageRepo.createMessage(data);
    const notification = await notificationService.createNotification({
        user: data.receiver,
        message: message._id
    });
    return{
        message,
        notification
    }
        

};



const getMessageById = async (id) => {
if (!id) { throw new appError("no id please add the id", 400) }
    return await messageRepo.findMessageById(id);
};

const markMessageAsSeen = async (id) => {
    if (!id) { throw new appError("no id please add the id", 400) }
    return await messageRepo.messageAsSeen(id);
};
const getMessagesByTicket = async (ticketId) => {
    if (!ticketId) {
        throw new appError("Ticket id is required", 400);
    }

    return await messageRepo.findMessagesByTicket(ticketId);
};

const deleteMessage = async (id) => {
    if (!id) { throw new appError("no id please add the id", 400) }
    return await messageRepo.deleteMessage(id);
};

module.exports = {
    sendMessage,
    getMessageById,
    markMessageAsSeen,
    deleteMessage,
    getMessagesByTicket
};