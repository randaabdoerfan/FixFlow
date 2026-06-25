const ticketRepo = require('../repositories/tickets.repo')
const appError = require('../utilities/appError')

exports.createTicket = async (data) => {
    if (!data) { throw new appError("no data", 400) }
    return await ticketRepo.createTicket(data)
}

exports.getAllTickets = async () => {
    return await ticketRepo.getAllTickets()
}

exports.getTicketById = async (id) => {
    if (!id) { throw new appError("no id please add the id", 400) }
    return await ticketRepo.getTicketById(id)
}