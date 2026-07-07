const { 
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    getUserByRole,
    getUserByEmail,
    getUserByTeam,
    getUserInformation,
    getUserByManager,
    updateAvatar,
    updatePassword } = require('../services/user.service');
const generateToken = require('../utilities/genrateToken');
const AppError = require('../utilities/appError');



exports.getAllUsers = async (req, res) => {
    try {
        const users = await getAllUsers();
        res.status(200).json(users);
    } catch (err) {

        res.status(400).json({
            success: false,
            message: err.message
        });
    }
};

exports.getUserById = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await getUserById(id);
        res.status(200).json(user);
    } catch (err) {

        res.status(400).json({
            success: false,
            message: err.message
        });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const id = req.params.id;
        console.log(req.body);
        const updatedUser = await updateUser(id, req.body);
        res.status(200).json(updatedUser);
    } catch (err) {
        res.status(400).json({
            success: false,
            message: err.message
        });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const id = req.params.id;
        await deleteUser(id);
        res.status(204).json({ message: 'User deleted successfully' });
    } catch (err) {

        res.status(400).json({
            success: false,
            message: err.message
        });
    }
};


exports.getUserByEmail = async (req, res) => {
    try {
        const email = req.params.email;
        const user = await getUserByEmail(email);
        res.status(200).json(user);
    } catch (err) {
        res.status(400).json({
            success: false,
            message: err.message
        });
    }
};

exports.getUserByTeam = async (req, res) => {
    try {
        const teamId = req.params.team;
        const users = await getUserByTeam(teamId);
        res.status(200).json(users);
    } catch (err) {
        res.status(400).json({
            success: false,
            message: err.message
        });
    }
};

exports.getUserByRole = async (req, res) => {
    try {
        const role = req.params.role;
        const users = await getUserByRole(role);
        res.status(200).json(users);
    } catch (err) {
        res.status(400).json({
            success: false,
            message: err.message
        });
    }
};

exports.getUserInformation = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await getUserInformation(id);
        res.status(200).json(user);
    } catch (err) {
        res.status(400).json({
            success: false,
            message: err.message
        });
    }
};

exports.updatePassword = async (req, res) => {
    try {
        const id = req.params.id;
        const { oldPassword, newPassword } = req.body;
        await updatePassword(id, oldPassword, newPassword);
        res.status(200).json({ message: 'Password updated successfully' });
    } catch (err) {
        res.status(400).json({
            success: false,
            message: err.message
        });
    }
};

exports.getUserByManagerId = async (req, res) => {
    try {
        const managerId = req.params.managerId;
        const users = await getUserByManager(managerId);
        res.status(200).json(users);
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

exports.updateAvatar = async (req, res) => {
    try {
        const id = req.params.id;
        const avatar = req.file.path;
        const user = await updateAvatar(id, avatar);
        res.status(200).json({ success: true, message: 'Avatar updated successfully', data: user });
    } catch (err) {
        res.status(400).json({
            success: false,
            message: err.message
        });
    }
};

exports.getUserCount = async (req, res) => {
    try {
        const counts = await require('../services/user.service').getUserCount();
        res.status(200).json({ success: true, data: counts });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

exports.toggleUserStatus = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await require('../services/user.service').toggleUserStatus(id);
        res.status(200).json({ success: true, data: user });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

exports.getDashboardStats = async (req, res) => {
    try {
        const stats = await require('../services/user.service').getDashboardStats();
        res.status(200).json({ success: true, data: stats });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

exports.getAgentsWithWorkload = async (req, res) => {
    try {
        const agents = await require('../services/user.service').getAgentsWithWorkload();
        res.status(200).json({ success: true, data: agents });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

exports.getOnlineUsers = async (req, res) => {
    try {
        const onlineUsers = req.app.get("onlineUsers");
        res.status(200).json({ success: true, data: Array.from(onlineUsers || []) });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};
