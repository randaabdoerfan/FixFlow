const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticket.controller');

router.post('/createTicket', ticketController.createNewTicket);
router.get('/getAllTickets', ticketController.getAllTickets);
router.get('/getTicketById/:id', ticketController.getTicketById);
router.get('/getTicketByStatus/:status', ticketController.getTicketByStatus);
router.get('/getAssignedTicket/:id', ticketController.getAssignedTicket);
router.get('/getTicketByTeam/:id', ticketController.getTicketByTeam);
router.get('/getTicketInfo/:id', ticketController.getTicketInfo);
router.get('/getTicketByUser/:id', ticketController.getTicketByUser);
router.put('/updateTicket/:id', ticketController.updateTicket);
router.put('/assignTicket/:id', ticketController.assignTicket);
router.put('/changeStatus/:id', ticketController.changeTicketStatus);
router.put('/markInProgress/:id', ticketController.markInProgress);
router.delete('/deleteTicket/:id', ticketController.deleteTicket);

module.exports = router