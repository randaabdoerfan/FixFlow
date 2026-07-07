const express = require("express");
const router = express.Router();

const messageController = require("../controllers/message.controller");

const verifyToken = require("../middleware/verifytoken.middleware");

router.post("/create", verifyToken('login'), messageController.sendMessage);

router.get("/ticket/:ticketId", verifyToken('login'), messageController.getMessagesByTicket);

router.get("/:id", verifyToken('login'), messageController.getMessageById);

router.patch("/:id/seen", verifyToken('login'), messageController.markMessageAsSeen);

router.delete("/:id", verifyToken('login'), messageController.deleteMessage);

router.get("/conversation/:user1/:user2", verifyToken('login'), messageController.getConversation);

module.exports = router;