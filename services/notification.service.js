const notificationRepo = require('../repositories/notification.repository');

const createNotification = async (data) => {
    return await notificationRepo.createNotification(data);
};

const getUserNotifications = async (userId) => {
    return await notificationRepo.findNotificationByUser(userId);
};

const getUnreadNotifications = async (userId) => {
    return await notificationRepo.findUnread(userId);
};

const markNotificationAsSeen = async (id) => {
    return await notificationRepo.markAsSeen(id);
};

const markAllAsSeen = async (userId) => {
    return await notificationRepo.markAllAsSeen(userId);
};

const deleteNotification = async (id) => {
    return await notificationRepo.deleteNotification(id);
};

module.exports = {
    createNotification,
    getUserNotifications,
    getUnreadNotifications,
    markNotificationAsSeen,
    markAllAsSeen,
    deleteNotification
};