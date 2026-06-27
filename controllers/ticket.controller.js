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

exports.getTicketByStatus= async(req,res)=>{
    try{
        const status = req.params.status
        const ticket = await ticketServices.getTicketByStatus(status)
        res.status(200).json(ticket)
    }catch(err){console.log(err)}
}