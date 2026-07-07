const ticketServices = require('../services/ticket.service')

exports.createNewTicket= async(req,res)=>{
    try{
        const userRepo = require('../repositories/user.repo');
	const teamRepo = require('../repositories/team.repository');
        const data = { ...req.body, createdBy: req.body.createdBy || req.user.userId }
        const chosenTeam = data.team;
        if (!data.team || data.team === '' || data.team === 'other') {
            const admins = await userRepo.getUserByRole('admin');
            if (admins.length > 0) {
                data.assignedTo = admins[0]._id;
            }
        }
        const newTicket = await ticketServices.createTicket(data)
        const notificationService = require('../services/notification.service');
        const io = req.app.get("io");
        if (chosenTeam && chosenTeam !== '' && chosenTeam !== 'other') {
            const team = await teamRepo.findById(chosenTeam);
            if (team && team.managerId) {
                const notification = await notificationService.createNotification({
                    user: team.managerId.toString(),
                    body: `A new ticket "${newTicket.title}" was created in your team "${team.name}".`,
                });
                if (io) io.to(team.managerId.toString()).emit("newNotification", notification);
            }
        } else {
            const admins = await userRepo.getUserByRole('admin');
            for (const admin of admins) {
                const notification = await notificationService.createNotification({
                    user: admin._id,
                    body: `A new teamless ticket "${newTicket.title}" has been auto-assigned to admin.`,
                });
                if (io) io.to(admin._id.toString()).emit("newNotification", notification);
            }
        }
        res.status(201).json(newTicket)
    }catch(err){
        console.log(err)
        res.status(400).json({ success: false, message: err.message })
    }
}

exports.getAllTickets= async(req,res)=>{
    try{
        const tickets = await ticketServices.getAllTickets()
        res.status(200).json(tickets)
    }catch(err){
        console.log(err)
        res.status(400).json({ success: false, message: err.message })
    }
}
exports.getTicketById= async(req,res)=>{
    try{
        const id = req.params.id
        const ticket = await ticketServices.getTicketById(id)
        res.status(200).json(ticket)
    }catch(err){console.log(err)}
}

exports.getTicketByUserId= async(req,res)=>{
    try{
        const id = req.params.id
        const ticket = await ticketServices.getTicketByUserId(id)
        res.status(200).json(ticket)
    }catch(err){console.log(err)}
}

exports.updateTicket= async(req,res)=>{
    try{
        const id = req.params.id
        const data = req.body
        const ticket = await ticketServices.updateTicket(id,data)
        res.status(200).json(ticket)
    }catch(err){console.log(err)}
}

exports.deleteTicket = async(req,res)=>{
    try{
        const id = req.params.id
        const ticket = await ticketServices.deleteTicket(id)
        res.status(200).json({ message: `ticket with id ${id} deleted successfully` })
    }catch(err){console.log(err)}
}

exports.getTicketByTeam= async(req,res)=>{
    try{
        const id = req.params.id
        const ticket = await ticketServices.getTicketByTeam(id)
        res.status(200).json(ticket)
    }catch(err){console.log(err)}
}

exports.getAssignedTicket= async(req,res)=>{
    try{
        const id = req.params.id
        const ticket = await ticketServices.getAssignedTicket(id)
        res.status(200).json(ticket)
    }catch(err){console.log(err)}
}

exports.getTicketByStatus= async(req,res)=>{
    try{
        const status = req.params.status
        const ticket = await ticketServices.getTicketByStatus(status)
        res.status(200).json(ticket)
    }catch(err){console.log(err)}
}

exports.getTicketInfo = async(req,res)=>{
    try{
        const id = req.params.id
        const ticket = await ticketServices.getTicketInfo(id)
        res.status(200).json(ticket)
    }catch(err){console.log(err)}
}

exports.assignTicket = async (req, res, next) => {
    try {
      const { assignedTo } = req.body;
      const ticket = await ticketServices.assignTicket(req.params.id, assignedTo, req.user.userId);
      req.app.get("io").to(assignedTo).emit("ticketAssigned", ticket);
      res.status(200).json({ status: "success", data: ticket });
    } catch (err) {
      next(err);
    }
  };
  
  exports.changeTicketStatus = async (req, res, next) => {
    try {
      const { status } = req.body;
      const ticket = await ticketServices.changeStatus(req.params.id, status, req.user);
      res.status(200).json({ status: "success", data: ticket });
    } catch (err) {
      next(err);
    }
  };
  
  exports.markInProgress = async (req, res, next) => {
    try {
      // "inProgress" is just another state-machine transition — reuse changeStatus
      // so the assigned-agent / manager permission checks still apply
      const ticket = await ticketServices.changeStatus(req.params.id, "inProgress", req.user);
      res.status(200).json({ status: "success", data: ticket });
    } catch (err) {
      next(err);
    }
  };

  exports.requestClose = async (req, res, next) => {
    try {
      const ticket = await ticketServices.getTicketById(req.params.id);
      if (!ticket) return res.status(404).json({ success: false, message: "Ticket not found" });
      if (ticket.status !== "resolved") {
        return res.status(400).json({ success: false, message: "Only resolved tickets can be requested for closure" });
      }
      const userRepo = require('../repositories/user.repo');
      const admins = await userRepo.getUserByRole('admin');
      const notificationService = require('../services/notification.service');
      const io = req.app.get("io");
      for (const admin of admins) {
        const notification = await notificationService.createNotification({
          user: admin._id,
          body: `Ticket "${ticket.title}" is resolved and awaiting your closure.`,
        });
        if (io) {
          io.to(admin._id.toString()).emit("newNotification", notification);
        }
      }
      res.status(200).json({ success: true, message: "Closure request sent to admins" });
    } catch (err) {
      next(err);
    }
  };

  exports.getDashboardCounts = async (req, res) => {
  try {
    const counts = await ticketServices.getDashboardCounts();

    return res.status(200).json({
      success: true,
      data: counts,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};