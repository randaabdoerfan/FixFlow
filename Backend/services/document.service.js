const {createDocument,
    getDocumentById,
    getAllDocuments,
    getDocumentsByTeamId,
    getDocumentsByUserId,
    deleteDocument,
getDocumentsByTicketId} = require('../repositories/documents.repo');
const AppError = require('../utilities/appError');

exports.createDocument = async (data) => {
    if (!data) { throw new AppError("no data", 400) }
    return await createDocument(data)
}
exports.getDocumentById = async (id) => {
    if (!id) { throw new AppError("no id please add the id", 400) }
    return await getDocumentById(id)
}

exports.getAllDocuments = async () => {
    return await getAllDocuments()
}

exports.getDocumentsByTeamId = async (teamId) => {
    if (!teamId) { throw new AppError("no team id please add the team id", 400) }
    return await getDocumentsByTeamId(teamId)
}

exports.getDocumentsByUserId = async (userId) => {
    if (!userId) { throw new AppError("no user id please add the user id", 400) }
    return await getDocumentsByUserId(userId)
}

exports.getDocumentsByTicketId = async (ticketId) => {
    if (!ticketId) { throw new AppError("no ticket id please add the ticket id", 400) }
    return await getDocumentsByTicketId(ticketId)
}

exports.deleteDocument = async (id) => {
    if (!id) { throw new AppError("no id please add the id", 400) } 
    return await deleteDocument(id)
}

exports.getMyDocuments = async (userId) => {
    if (!userId) throw new AppError("no user id", 400)
    return await require('../repositories/documents.repo').getDocumentsByUserTickets([userId])
}