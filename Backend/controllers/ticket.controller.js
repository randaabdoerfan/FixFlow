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