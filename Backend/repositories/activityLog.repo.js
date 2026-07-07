const ActivityLog = require('../models/ativityLogs.model');

exports.createLog = async (data) => {
    return await ActivityLog.create(data);
};

exports.getLogsByTicket = async (ticketId) => {
    return await ActivityLog.find({ ticketId })
        .populate('user', 'name email role')
        .sort({ createdAt: -1 });
};

exports.getLogsByUser = async (userId) => {
    return await ActivityLog.find({ user: userId })
        .populate('ticketId', 'title status')
        .sort({ createdAt: -1 });
};

exports.getAllLogs = async () => {
    return await ActivityLog.find()
        .populate('user', 'name email role')
        .populate('ticketId', 'title status')
        .sort({ createdAt: -1 })
        .limit(200);
};
