const ticketRepo = require('../repositories/tickets.repo');
const teamRepo = require('../repositories/team.repository');
const userRepo = require('../repositories/user.repo');
const activityLogRepo = require('../repositories/activityLog.repo');
const emailService = require('./email.service');

const AppError = require('../utilities/appError')

exports.createTicket = async (data) => {
    if (!data) { throw new AppError("no data", 400) }

    if (!data.team || data.team === "" || !data.team.match(/^[0-9a-fA-F]{24}$/)) {
      delete data.team
      const adminUser = await userRepo.getUserByRole('admin');
      if (adminUser && adminUser.length > 0) {
        data.assignedTo = adminUser[0]._id;
      }
    }

    const ticket = await ticketRepo.createTicket(data)

    if (data.createdBy) {
        await activityLogRepo.createLog({
            ticketId: ticket._id,
            user: data.createdBy,
            action: 'created',
            description: `Ticket "${ticket.title}" was created`,
        })
        try {
            const creatorUser = await userRepo.getUserById(data.createdBy);
            if (creatorUser && creatorUser.email) {
                emailService.ticketCreatedEmail(creatorUser.email, creatorUser.name || 'User', ticket.title);
            }
        } catch (emailErr) {
            console.log('Failed to send creation email:', emailErr.message);
        }
    }

    return ticket
}

exports.getAllTickets = async () => {
    return await ticketRepo.getAllTickets()
}

exports.getTicketById = async (id) => {

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

exports.getAssignedTicket= async (userId)=>{
    return await ticketRepo.getAssignedTicket(userId)
}

exports.getTicketByStatus = async (status)=>{
    return await ticketRepo.getTicketByStatus(status)
}

exports.getTicketByUserId = async (userId)=>{
    return await ticketRepo.getTicketByUserId(userId)
}

exports.getTicketInfo = async (id)=>{
    return await ticketRepo.getTicketInfo(id)
}

const STATUS_TRANSITTION ={
    opened : ["assignedTo"],
    assignedTo : ["inProgress"],
    inProgress : ["resolved"],
    resolved : ["closed"],
    closed : ["opened"],
};

exports.assignTicket = async (ticketId, assignedTo, userId) => {
    const actingUser = await userRepo.getUserById(userId);
    if (!actingUser) throw new AppError('User not found', 404);
  
    if (!['admin', 'manager'].includes(actingUser.role)) {
      throw new AppError('Only admin or manager can assign ticket', 403);
    }
  
    const ticket = await ticketRepo.getTicketById(ticketId);
    if (!ticket) throw new AppError('Ticket not found', 404);
  
    if (!STATUS_TRANSITTION[ticket.status].includes('assignedTo')) {
      throw new AppError('Ticket is not in a state to be assigned', 400);
    }
  
    // only check when ticket already has a team — null team means any manager can assign
    if (actingUser.role === 'manager' && ticket.team) {
      const team = await teamRepo.findById(ticket.team);
      if (!team) throw new AppError('Team not found', 404);
  
      if (team.managerId && team.managerId.toString() !== actingUser._id.toString()) {
        throw new AppError('Only this team manager can assign ticket', 403);
      }
    }
  
    const agent = await userRepo.getUserById(assignedTo);
    if (!agent) throw new AppError('Agent not found', 404);
    if (agent.role !== 'agent') {
      throw new AppError('Assigned user must have the agent role', 400);
    }
    if (!agent.team) {
      throw new AppError('Agent must belong to a team', 400);
    }
  
    const updateData = { status: 'assignedTo', assignedTo: agent._id };

    if (ticket.team) {
      if (agent.team.toString() !== ticket.team.toString()) {
        throw new AppError('This agent is not part of this team', 400);
      }
    } else {
      updateData.team = agent.team;
    }

    const updated = await ticketRepo.updateStatus(ticketId, updateData);

    await activityLogRepo.createLog({
      ticketId: ticket._id,
      user: actingUser._id,
      action: 'assigned',
      description: `Ticket assigned to ${agent.name} by ${actingUser.name} (${actingUser.role})`,
      metadata: { assignedTo: agent._id, assignedToName: agent.name, assignedBy: actingUser._id, assignedByRole: actingUser.role },
    })

    try {
      if (agent.email) {
        emailService.ticketAssignedEmail(agent.email, agent.name || 'User', ticket.title);
      }
    } catch (emailErr) {
      console.log('Failed to send assignment email:', emailErr.message);
    }

    return updated;
  };

  exports.changeStatus = async (id, newStatus, user) => {
    const ticket = await ticketRepo.getTicketById(id);
    if (!ticket) throw new AppError('Ticket not found', 404);
  
    const isAdmin = user.role === 'admin';
    const isAssignedAgent = ticket.assignedTo?.toString() === user.userId;
    const isManagerOrAdmin = ["manager", "admin"].includes(user.role);

    if (!isAdmin) {
      const allowedNext = STATUS_TRANSITTION[ticket.status] || [];
      if (!allowedNext.includes(newStatus)) {
        throw new AppError(`Status change not allowed from ${ticket.status} to ${newStatus}`, 400);
      }
    }
  
    if (newStatus === "resolved" && !isAssignedAgent && !isManagerOrAdmin) {
      throw new AppError("Only the assigned agent can resolve this ticket", 403);
    }
    if (newStatus === "closed" && !isManagerOrAdmin) {
      throw new AppError("Only admin/manager can close a ticket", 403);
    }
  
    const updateData = { status: newStatus };
    if (newStatus === "resolved") updateData.resolvedAt = Date.now();
    if (newStatus === "closed") updateData.closedAt = Date.now();

    const updated = await ticketRepo.updateStatus(id, updateData);

    const actionMap = {
      opened: 'status_changed',
      assignedTo: 'status_changed',
      inProgress: 'status_changed',
      resolved: 'resolved',
      closed: 'closed',
    }
    const action = actionMap[newStatus] || 'status_changed'
    const roleLabel = user.role ? ` (${user.role})` : ''
    const description = `Ticket "${ticket.title}" status changed from ${ticket.status} to ${newStatus} by ${user.userId}${roleLabel}`

    await activityLogRepo.createLog({
      ticketId: ticket._id,
      user: user.userId || user._id,
      action,
      description,
      metadata: { fromStatus: ticket.status, toStatus: newStatus, changedBy: user.role },
    })

    try {
      const fullTicket = await ticketRepo.getTicketInfo(id);
      const creatorUser = fullTicket.createdBy;
      if (creatorUser && creatorUser.email) {
        emailService.statusChangeEmail(creatorUser.email, creatorUser.name || 'User', ticket.title, newStatus);
      }
      if (fullTicket.assignedTo && fullTicket.assignedTo.email) {
        const assignee = fullTicket.assignedTo;
        if (!creatorUser || assignee._id.toString() !== creatorUser._id.toString()) {
          emailService.statusChangeEmail(assignee.email, assignee.name || 'User', ticket.title, newStatus);
        }
      }
    } catch (emailErr) {
      console.log('Failed to send status change email:', emailErr.message);
    }

    return updated;
  };




exports.getDashboardCounts = async () => {
  return await ticketRepo.getDashboardCounts();
};