const messageRepo = require("../repositories/message.repo");
const notificationService = require("./notification.service");
const AppError = require("../utilities/appError");

const sendMessage = async (data) => {
    // !data.ticket_id 
    if (!data.sender || !data.receiver || !data.body) {
        throw new AppError("Missing required fields", 400);
    }

    // Create Message
    const message = await messageRepo.createMessage(data);

    // Create Notification
    const notification = await notificationService.createNotification({
        user: data.receiver,
        message: message._id,
    });

    return {
        message,
        notification,
    };
};

const getMessageById = async (id) => {
    if (!id) {
        throw new AppError("Message id is required", 400);
    }

    return await messageRepo.findMessageById(id);
};

const getMessagesByTicket = async (ticketId) => {
    if (!ticketId) {
        throw new AppError("Ticket id is required", 400);
    }

    return await messageRepo.findMessagesByTicket(ticketId);
};

const markMessageAsSeen = async (id) => {
    if (!id) {
        throw new AppError("Message id is required", 400);
    }

    return await messageRepo.messageAsSeen(id);
};

const deleteMessage = async (id) => {
    if (!id) {
        throw new AppError("Message id is required", 400);
    }

    return await messageRepo.deleteMessage(id);
};

const getConversation = async (user1, user2) => {
    if (!user1 || !user2) {
        throw new AppError("Both user ids are required", 400);
    }
    return await messageRepo.findConversation(user1, user2);
};

module.exports = {
    sendMessage,
    getMessageById,
    getMessagesByTicket,
    markMessageAsSeen,
    deleteMessage,
    getConversation,
};