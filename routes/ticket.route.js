const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticket.controller');

router.post('/createTicket', ticketController.createNewTicket);

module.exports = router