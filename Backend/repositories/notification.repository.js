const Notification = require('../models/notification.model')

exports.createNotification = async (data) => {
    const notif = await Notification.create(data);
    return await Notification.findById(notif._id)
        .populate({
            path: 'message',
            populate: { path: 'sender', select: 'name email' }
        });
};
exports.findNotificationByUser = async (userId) => {
    return await Notification.find({ user: userId })
        .populate({
            path: 'message',
            populate: { path: 'sender', select: 'name email' }
        })
        .sort({ createdAt: -1 });
};

exports.findUnread = async (userId) => {
    return await Notification.find({
        user: userId,
        is_seen: false
    })
        .populate({
            path: 'message',
            populate: { path: 'sender', select: 'name email' }
        })
        .sort({ createdAt: -1 });
};

exports.markAsSeen = async (id) => {
    return await Notification.findByIdAndUpdate(
        id,
        { is_seen: true },
        { returnDocument: 'after' }
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