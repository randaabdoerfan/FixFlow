const express = require("express");
const router = express.Router();

const messageController = require("../controllers/message.controller");

const verifyToken = require("../middleware/verifytoken.middleware");

router.post("/create", messageController.sendMessage);

router.get("/ticket/:ticketId", messageController.getMessagesByTicket);

router.get("/:id", verifyToken, messageController.getMessageById);

router.patch("/:id/seen", verifyToken, messageController.markMessageAsSeen);

router.delete("/:id", verifyToken, messageController.deleteMessage);
module.exports = router;