const ticketRepo = require('../repositories/tickets.repo')
<<<<<<< HEAD
const appError = require('../utilities/appError')

exports.createTicket = async (data) => {
    if (!data) { throw new appError("no data", 400) }
=======
const AppError = require('../utilities/appError')

exports.createTicket = async (data) => {
    if (!data) { throw new AppError("no data", 400) }
>>>>>>> origin/main
    return await ticketRepo.createTicket(data)
}

exports.getAllTickets = async () => {
    return await ticketRepo.getAllTickets()
}

exports.getTicketById = async (id) => {
<<<<<<< HEAD
    if (!id) { throw new appError("no id please add the id", 400) }
    return await ticketRepo.getTicketById(id)
=======
    if (!id) { throw new AppError("no id please add the id", 400) }
    return await ticketRepo.getTicketById(id)
}

exports.updateTicket = async (id, data) => {
    if (!id) { throw new AppError("no id please add the id", 400) }
    if (!data) { throw new AppError("no data", 400) }
    return await ticketRepo.updateTicket(id, data)
}

exports.deleteTicket = async (id) => {
    if (!id) { throw new AppError("no id please add the id", 400) }
    return await ticketRepo.deleteTicket(id)
}

exports.getTicketByUser = async (userId)=>{
    return await ticketRepo.getTicketByUser(userId)
}

exports.getTicketByTeam = async (teamId)=>{
    return await ticketRepo.getTicketByTeam(teamId)
}

exports.getAssignedTickets = async (userId)=>{
    return await ticketRepo.getAssignedTickets(userId)
}

exports.getTicketByStatus = async (status)=>{
    return await ticketRepo.getTicketByStatus(status)
}

exports.getTicketInfo = async (id)=>{
    return await ticketRepo.getTicketInfo(id)
}

exports.updateStatus = async (id,status)=>{
    return await ticketRepo.updateStatus(id,status)
>>>>>>> origin/main
}