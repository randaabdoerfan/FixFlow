const ticketServices = require('../services/ticket.service');
const logService=require('../services/log.service');

exports.createTicket= async(req,res)=>{
    try{
        const newTicket = await ticketServices.createTicket(req.body)
        res.status(201).json(newTicket)
    }catch(err){console.log(err)
        res.status(500).json({
            error:err.message
        })
    }
}
exports.assignTicket=async(req,res)=>{
    try{
        const ticket =await ticketServices.assignTicket(req.params.ticketId,req.body.assignedTo);
        res.json(ticket);
    }catch(err){
        res.status(400).json({
            error:err.message
        });
    }
}
exports.changeStatus=async(req,res)=>{
    try{
        const ticket=await ticketServices.changeStatus(req.params.ticketId,req.body.status);
        res.json(ticket);
    }catch(err){
        res.status(400).json({
            error:err.message
        });
    }
}
exports.getAllTickets= async(req,res)=>{
    try{
        const tickets = await ticketServices.getAllTickets()
        res.status(200).json(tickets)
    }catch(err){console.log(err)
        res.status(500).json({
            error:err.message
        })
    }
}
exports.getTicketById= async(req,res)=>{
    try{
        const id = req.params.id
        const ticket = await ticketServices.getTicketById(id)
        res.status(200).json(ticket)
    }catch(err){console.log(err)
        res.status(500).json({
            error:err.message
        })
    }
}

exports.updateTicket= async(req,res)=>{
    try{
        const id = req.params.id
        const data = req.body
        const ticket = await ticketServices.updateTicket(id,data)
        res.status(200).json(ticket)
    }catch(err){console.log(err)
        res.status(500).json({
            error:err.message
        })
    }
}

exports.deleteTicket = async(req,res)=>{
    try{
        const id = req.params.ticketId
        const ticket = await ticketServices.deleteTicket(id)
        res.status(200).json({message:`ticket with id ${id} deleted successfully`})
    }catch(err){console.log(err)
        res.status(500).json({
            error:err.message
        })
    }
}

exports.getTicketByTeam= async(req,res)=>{
    try{
        const id = req.params.id
        const ticket = await ticketServices.getTicketByTeam(id)
        res.status(200).json(ticket)
    }catch(err){console.log(err)
        res.status(500).json({
            error:err.message
        })
    }
}

exports.getAssignedTicket= async(req,res)=>{
    try{
        const id = req.params.id
        const ticket = await ticketServices.getAssignedTicket(id)
        res.status(200).json(ticket)
    }catch(err){console.log(err);
        res.status(500).json({
            error:err.message
        })
    }
}

exports.getTicketInfo = async(req,res)=>{
    try{
        const id = req.params.id
        const ticket = await ticketServices.getTicketInfo(id)
        res.status(200).json(ticket)
    }catch(err){console.log(err);
        res.status(500).json({
            error:err.message
        })
    }
}

exports.getTicketByStatus= async(req,res)=>{
    try{
        const status = req.params.status
        const ticket = await ticketServices.getTicketByStatus(status)
        res.status(200).json(ticket)
    }catch(err){console.log(err)
        res.status(500).json({
            error:err.message
        })
    }
}
