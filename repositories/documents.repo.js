const Document = require('../models/documents.model');

exports.createDocument = async (data) => {
    return await Document.create(data)
}

exports.getAllDocuments = async () => {
    return await Document.find()
}

exports.getDocumentById = async (id) => {
    return await Document.findById(id)
}

exports.deleteDocument = async (id) => {
    return await Document.findByIdAndDelete(id)
}   

exports.getDocumentsByUserId = async (userId) => {
    return await Document.find({ user: userId })
}   

exports.getDocumentsByTeamId = async (teamId) => {
    return await Document.find({ team: teamId })
}   
exports.getDocumentsByTicketId = async (ticketId) => {
    return await Document.find({ ticket_id: ticketId })
}   