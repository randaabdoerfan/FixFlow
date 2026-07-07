const notificationRepo = require("../repositories/notification.repository");
const AppError = require("../utilities/appError");

const createNotification = async (data) => {
    if (!data.user || (!data.message && !data.body)) {
        throw new AppError("User and message or body are required", 400);
    }

    return await notificationRepo.createNotification(data);
};

const getUserNotifications = async (userId) => {
    if (!userId) {
        throw new AppError("User id is required", 400);
    }

    return await notificationRepo.findNotificationByUser(userId);
};

const getUnreadNotifications = async (userId) => {
    if (!userId) {
        throw new AppError("User id is required", 400);
    }

    return await notificationRepo.findUnread(userId);
};

const markNotificationAsSeen = async (id) => {
    if (!id) {
        throw new AppError("Notification id is required", 400);
    }

    return await notificationRepo.markAsSeen(id);
};

const markAllAsSeen = async (userId) => {
    if (!userId) {
        throw new AppError("User id is required", 400);
    }

    return await notificationRepo.markAllAsSeen(userId);
};

const deleteNotification = async (id) => {
    if (!id) {
        throw new AppError("Notification id is required", 400);
    }

    return await notificationRepo.deleteNotification(id);
};

module.exports = {
    createNotification,
    getUserNotifications,
    getUnreadNotifications,
    markNotificationAsSeen,
    markAllAsSeen,
    deleteNotification,
};