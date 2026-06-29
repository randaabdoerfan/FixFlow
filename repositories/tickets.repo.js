const Ticket = require('../models/tickets.model')



exports.createTicket = async (data) => {
    return await Ticket.create(data)

}
exports.getAllTickets = async () => {
    return await Ticket.find()

}
exports.getTicketById = async (id) => {

    return await Ticket.findById(id)
}

exports.updateTicket = async (id, data) => {
    return await Ticket.findByIdAndUpdate(id, data, { new: true ,runValidators:true})

}
exports.deleteTicket = async (id) => {
    return await Ticket.findByIdAndDelete(id)
}

exports.getTicketByUser = async (userId) => {
    return await Ticket.find({ createdBy: userId })
}

exports.getTicketByTeam = async (teamId) => {
    return await Ticket.find({ team: teamId })
}

exports.getTicketByUserId = async (userId) => {
    return await Ticket.find({ createdBy: userId })
}

exports.getAssignedTicket = async (memberId) => {
    return await Ticket.find({ assignedTo: memberId })
}

exports.getTicketByStatus = async (status) => {
    return await Ticket.find({ status: status })
}

exports.getTicketInfo = async (id) => {
    return await Ticket.findById(id)
        
        .populate("createdBy")
        .populate("assignedTo")
        .populate("team");
}

exports.updateStatus = async (id, data) => {
    return await Ticket.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  };
