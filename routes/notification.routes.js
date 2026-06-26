const express = require("express");
const router = express.Router();

const notificationController = require("../controllers/notification.controller");

// Create notification
router.post("/create", notificationController.createNotification);

// Get all notifications for a user
router.get("/user/:userId", notificationController.getUserNotifications);

// Get unread notifications
router.get("/user/:userId/unread", notificationController.getUnreadNotifications);

// Mark notification as seen
router.patch("/:id/seen", notificationController.markNotificationAsSeen);

// Mark all notifications as seen
router.patch("/user/:userId/seen-all", notificationController.markAllAsSeen);

// Delete notification
router.delete("/:id", notificationController.deleteNotification);

module.exports = router;
