const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifytoken.middleware');
const authorize = require('../middleware/authorize.middleware');
const activityLogRepo = require('../repositories/activityLog.repo');

router.get('/ticket/:ticketId', verifyToken('login'), async (req, res, next) => {
    try {
        const logs = await activityLogRepo.getLogsByTicket(req.params.ticketId);
        res.status(200).json({ success: true, data: logs });
    } catch (err) {
        next(err);
    }
});

router.get('/user/:userId', verifyToken('login'), async (req, res, next) => {
    try {
        const logs = await activityLogRepo.getLogsByUser(req.params.userId);
        res.status(200).json({ success: true, data: logs });
    } catch (err) {
        next(err);
    }
});

router.get('/all', verifyToken('login'), authorize('admin'), async (req, res, next) => {
    try {
        const logs = await activityLogRepo.getAllLogs();
        res.status(200).json({ success: true, data: logs });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
