const express = require("express");
const router = express.Router();

const messageController = require("../controllers/message.controller");

// Send a message
router.post("/create", messageController.sendMessage);

// Get a message by id
router.get("/:id", messageController.getMessageById);
//:get Mesagge by taket_id
router.get("/ticket/:ticketId", messageController.getMessagesByTicket);

// Mark a message as seen
router.patch("/:id/seen", messageController.markMessageAsSeen);

// Delete a message
router.delete("/:id", messageController.deleteMessage);

module.exports = router;
