const ticketServices = require('../services/ticket.service')

exports.createNewTicket= async(req,res)=>{
    try{
        const newTicket = await ticketServices.createTicket(req.body)
        res.status(201).json(newTicket)
    }catch(err){console.log(err)}
}

exports.getAllTickets= async(req,res)=>{
    try{
        const tickets = await ticketServices.getAllTickets()
        res.status(200).json(tickets)
    }catch(err){console.log(err)}
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
        res.status(200).json(message=`ticket with id ${id} deleted successfully`)
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
      const ticket = await ticketServices.assignTicket(req.params.id, assignedTo, req.user.id);
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