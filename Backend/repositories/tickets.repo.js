const Ticket = require('../models/tickets.model')



exports.createTicket = async (data) => {
    return await Ticket.create(data)

}
exports.getAllTickets = async () => {
    return await Ticket.find()
        .populate('createdBy', 'name email')
        .populate('assignedTo', 'name email')
        .populate('team', 'name')
        .sort({ createdAt: -1 })
}
exports.getTicketById = async (id) => {

    return await Ticket.findById(id)
}

exports.updateTicket = async (id, data) => {
    return await Ticket.findByIdAndUpdate(id, data, { returnDocument: 'after', runValidators: true })

}
exports.deleteTicket = async (id) => {
    return await Ticket.findByIdAndDelete(id)
}

exports.getTicketByUser = async (userId) => {
    return await Ticket.find({ createdBy: userId })
        .populate('createdBy', 'name email')
        .populate('assignedTo', 'name email')
        .populate('team', 'name')
        .sort({ createdAt: -1 })
}

exports.getTicketByTeam = async (teamId) => {
    return await Ticket.find({ team: teamId })
        .populate('createdBy', 'name email')
        .populate('assignedTo', 'name email')
        .populate('team', 'name')
        .sort({ createdAt: -1 })
}

exports.getTicketByUserId = async (userId) => {
    return await Ticket.find({ createdBy: userId })
        .populate('createdBy', 'name email')
        .populate('assignedTo', 'name email')
        .populate('team', 'name')
        .sort({ createdAt: -1 })
}

exports.getAssignedTicket = async (memberId) => {
    return await Ticket.find({ assignedTo: memberId })
        .populate('createdBy', 'name email')
        .populate('assignedTo', 'name email')
        .populate('team', 'name')
        .sort({ createdAt: -1 })
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
    return await Ticket.findByIdAndUpdate(id, data, { returnDocument: 'after', runValidators: true });
  };

exports.countAssignedOpen = async (agentId) => {
    return await Ticket.countDocuments({
        assignedTo: agentId,
        status: { $ne: 'closed' }
    });
};

exports.getDashboardCounts = async () => {
  const [total, opened, inProgress, resolved, closed] = await Promise.all([
    Ticket.countDocuments(),
    Ticket.countDocuments({ status: "opened" }),
    Ticket.countDocuments({ status: "inProgress" }),
    Ticket.countDocuments({ status: "resolved" }),
    Ticket.countDocuments({ status: "closed" }),
  ]);

  return {
    total,
    opened,
    inProgress,
    resolved,
    closed,
  };
};

// exports.getDashboardCounts = async () => {
//   const result = await Incident.aggregate([
//     {
//       $group: {
//         _id: "$status",
//         count: { $sum: 1 }
//       }
//     }
//   ]);

//   const counts = {
//     total: 0,
//     opened: 0,
//     resolved: 0,
//     closed: 0,
//   };

//   result.forEach(item => {
//     counts.total += item.count;

//     if (item._id === "opened") counts.opened = item.count;
//     if (item._id === "resolved") counts.resolved = item.count;
//     if (item._id === "closed") counts.closed = item.count;
//   });

//   return counts;
// };