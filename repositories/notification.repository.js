const Notification = require('../models/notification.model')

exports.createNotification = async (data) => {
    return await Notification.create(data);
};
exports.findNotificationByUser = async (userId) => {
    return await Notification.find({ user: userId })
        .sort({ createdAt: -1 });
};

exports.findUnread = async (userId) => {
    return await Notification.find({
        user: userId,
        is_seen: false
    });
};

exports.markAsSeen = async (id) => {
    return await Notification.findByIdAndUpdate(
        id,
        { is_seen: true },
        { new: true }
    );
};

exports.markAllAsSeen = async (userId) => {
    return await Notification.updateMany(
        { user: userId },
        { is_seen: true }
    );
};


exports.deleteNotification = async (id) => {
    return await Notification.findByIdAndDelete(id);
};