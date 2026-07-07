const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticket.controller');
const verifyToken = require('../middleware/verifytoken.middleware');
const authorize = require('../middleware/authorize.middleware')
router.post('/createTicket', verifyToken('login'), ticketController.createNewTicket);
router.get('/getAllTickets', verifyToken('login'), ticketController.getAllTickets);
router.get('/getTicketById/:id', verifyToken('login'), ticketController.getTicketById);
router.get('/getTicketByStatus/:status', verifyToken('login'), ticketController.getTicketByStatus);
router.get('/getAssignedTicket/:id', verifyToken('login'), ticketController.getAssignedTicket);
router.get('/getTicketByTeam/:id', verifyToken('login'), ticketController.getTicketByTeam);
router.get('/getTicketInfo/:id', verifyToken('login'), ticketController.getTicketInfo);
router.get('/getTicketByUser/:id', verifyToken('login'), ticketController.getTicketByUserId);
router.put('/updateTicket/:id', verifyToken('login'), ticketController.updateTicket);
router.put('/assignTicket/:id', verifyToken('login'), authorize('admin', 'manager'), ticketController.assignTicket);
router.put('/changeStatus/:id', verifyToken('login'), ticketController.changeTicketStatus);
router.put('/markInProgress/:id', verifyToken('login'), ticketController.markInProgress);
router.post('/requestClose/:id', verifyToken('login'), ticketController.requestClose);
router.delete('/deleteTicket/:id', verifyToken('login'), authorize('admin'), ticketController.deleteTicket);

router.get(
  "/dashboard/counts",
  verifyToken("login"),
  authorize("manager", "admin"),
  ticketController.getDashboardCounts
);

module.exports = router