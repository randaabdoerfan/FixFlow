const Message =require('../models/message.model')
exports.createMessage=async(date)=>{
    return  await Message.create(date);

}
exports.findMessageById=async(id)=>{
    return await Message.findById(id);
}

exports.findMessagesByTicket = async (ticketId) => {
    return await Message.find({ ticket_id: ticketId })
        .populate("sender", "name email")
        .populate("receiver", "name email")
        .sort({ createdAt: 1 });
};

exports.messageAsSeen = async (id) => {
    return await Message.findByIdAndUpdate(
        id,
        { is_been_seen: true },
        { new: true }
    );
};

exports.deleteMessage = async (id) => {
    return await Message.findByIdAndDelete(id);
};


