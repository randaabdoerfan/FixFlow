const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticket.controller');

router.post('/createTicket', ticketController.createTicket);
router.get('/getAllTickets', ticketController.getAllTickets);
router.get('/getTicketById/:id', ticketController.getTicketById);
router.get('/getTicketByStatus/:status', ticketController.getTicketByStatus);
router.get('/getAssignedTicket/:id', ticketController.getAssignedTicket);
router.get('/getTicketByTeam/:id', ticketController.getTicketByTeam);
router.get('/getTicketInfo/:id', ticketController.getTicketInfo);
router.patch('/tickets/:ticketId/assign',ticketController.assignTicket);
router.patch('/tickets/:ticketId/status',ticketController.changeStatus);
router.put('/updateTicket/:id', ticketController.updateTicket);
router.delete('/deleteTicket/:ticketId', ticketController.deleteTicket);

module.exports = router