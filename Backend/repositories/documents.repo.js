const Document = require('../models/documents.model');

exports.createDocument = async (data) => {
    return await Document.create(data)
}

exports.getAllDocuments = async () => {
    return await Document.find()
        .populate('sender', 'name email')
        .populate('receiver', 'name email')
        .populate('ticket_id', 'title')
}

exports.getDocumentById = async (id) => {
    return await Document.findById(id)
        .populate('sender', 'name email')
        .populate('receiver', 'name email')
        .populate('ticket_id', 'title')
}

exports.deleteDocument = async (id) => {
    return await Document.findByIdAndDelete(id)
}   

exports.getDocumentsByUserId = async (userId) => {
    return await Document.find({ user: userId })
}   

exports.getDocumentsByTeamId = async (teamId) => {
    const Ticket = require('../models/tickets.model')
    const teamTickets = await Ticket.find({ team: teamId }).select('_id')
    const ticketIds = teamTickets.map(t => t._id)
    return await Document.find({ ticket_id: { $in: ticketIds } })
        .populate('sender', 'name email')
        .populate('receiver', 'name email')
        .populate('ticket_id', 'title')
}   
exports.getDocumentsByTicketId = async (ticketId) => {
    return await Document.find({ ticket_id: ticketId })
        .populate('sender', 'name email')
        .populate('receiver', 'name email')
}
exports.getDocumentsByUserTickets = async (userIds) => {
    const Ticket = require('../models/tickets.model')
    const userTickets = await Ticket.find({
        $or: [
            { createdBy: { $in: userIds } },
            { assignedTo: { $in: userIds } }
        ]
    }).select('_id')
    const ticketIds = userTickets.map(t => t._id)
    return await Document.find({ ticket_id: { $in: ticketIds } })
        .populate('sender', 'name email')
        .populate('receiver', 'name email')
        .populate('ticket_id', 'title')
}   