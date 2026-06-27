const ticketRepo = require('../repositories/tickets.repo')
const logRepository=require('../repositories/log.repo')
const appError = require('../utilities/appError')

const VALID_STATUSES = ['opened', 'assignedTo', 'inProgress', 'resolved', 'closed'];
exports.createTicket = async (data) => {
    if (!data) { throw new appError("no data", 400) }
    const ticket=await ticketRepo.createTicket(data);
    await logRepository.create({
        ticketId:ticket._id,
        status:ticket.status,
        client:ticket.createdBy,
    })
    return ticket
}
async function assignTicket(ticketId,assignedTo) {
    const ticket = await ticketRepo.updateStatus(ticketId,'assignedTo',{
        assignedTo:assignedTo});
        if (!ticket) throw new appError('Ticket not found',404);
    await logRepository.create({
        ticketId:ticket._id,
        status:'assignedTo',
        assignedTo:assignedTo,
        client:ticket.createdBy,
    })
    return ticket;
}
async function changeStatus(ticketId,status) {
    if(!VALID_STATUSES.includes(status)){
        throw new appError(`Invalid status: ${status}`,400);
    }
    const ticket =await ticketRepo.updateStatus(ticketId,status);
    if(!ticket)throw new appError('Ticket not found',404);
    await logRepository.create({
        ticketId:ticket._id,
        status,
        assignedTo:ticket.assignedTo,
        client:ticket.createdBy,
    });
    return ticket;
}

exports.getAllTickets = async () => {
    return await ticketRepo.getAllTickets()
}

exports.getTicketById = async (id) => {

    if (!id) { throw new appError("no id please add the id", 400) }
    return await ticketRepo.getTicketById(id)

    if (!id) { throw new appError("no id please add the id", 400) }
    return await ticketRepo.getTicketById(id)
}

exports.updateTicket = async (id, data) => {
    if (!id) { throw new appError("no id please add the id", 400) }
    if (!data) { throw new appError("no data", 400) }
    const ticket =await ticketRepo.updateTicket(id, data)
     await logRepository.create({
        ticketId:ticket._id,
        status:ticket.status,
        client:ticket.createdBy,
    })
    return ticket
}

exports.deleteTicket = async (id) => {
    if (!id) { throw new appError("no id please add the id", 400) }
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
    const ticket = await ticketRepo.updateStatus(id,status)
    if(!ticket)throw new appError('Ticket not found',404);
    await logRepository.create({
        ticketId:ticket._id,
        status:ticket.status,
        client:ticket.createdBy,
    })
    return ticket
}
module.exports={assignTicket,changeStatus}