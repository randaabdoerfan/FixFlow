const express = require("express");
const router = express.Router();

const notificationController = require("../controllers/notification.controller");

// Create Notification
router.post("/create", notificationController.createNotification);

// Get All Notifications
router.get(
    "/user/:userId",
    notificationController.getUserNotifications
);

// Get Unread Notifications
router.get(
    "/user/:userId/unread",
    notificationController.getUnreadNotifications
);

// Mark Notification As Seen
router.patch(
    "/:id/seen",
    notificationController.markNotificationAsSeen
);

// Mark All Notifications As Seen
router.patch(
    "/user/:userId/seen-all",
    notificationController.markAllAsSeen
);

// Delete Notification
router.delete("/:id", notificationController.deleteNotification);

module.exports = router;