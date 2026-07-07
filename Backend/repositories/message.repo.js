const Message = require("../models/message.model");

exports.createMessage = async (data) => {
    return await Message.create(data);
};

exports.findMessageById = async (id) => {
    return await Message.findById(id)
        .populate("sender", "name email")
        .populate("receiver", "name email")
        .populate("ticket_id");
};

exports.findMessagesByTicket = async (ticketId) => {
    return await Message.find({ ticket_id: ticketId })
        .populate("sender", "name email")
        .populate("receiver", "name email")
        .sort({ createdAt: 1 });
};

exports.messageAsSeen = async (id) => {
    return await Message.findByIdAndUpdate(
        id,
        {
            is_been_seen: true,
        },
        {
            returnDocument: 'after',
        }
    );
};

exports.deleteMessage = async (id) => {
    return await Message.findByIdAndDelete(id);
};

exports.findConversation = async (user1, user2) => {
    return await Message.find({
        $or: [
            { sender: user1, receiver: user2 },
            { sender: user2, receiver: user1 },
        ],
    })
        .populate("sender", "name email")
        .populate("receiver", "name email")
        .sort({ createdAt: 1 });
};