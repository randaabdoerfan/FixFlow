const User = require('../models/user.model');
const Team = require('../models/teams.model');

exports.createUser = async (data) => {
    const team = data.team ? await Team.findOne({ _id: data.team }) : null;
    data.team = team ? team._id : null;
    return await User.create(data)
}

exports.loginUser = async (data) => {
    return await User.findOne({ email: data.email })
}

exports.getAllUsers = async () => {
    return await User.find().select('-password -confirmPassword -refreshTokenHash')
}
exports.countAllUsers = async () => {
    return await User.countDocuments()
}
exports.countByRole = async (role) => {
    return await User.countDocuments({ role })
}
exports.toggleUserStatus = async (id) => {
    const user = await User.findById(id)
    if (!user) return null
    user.isActive = !user.isActive
    await user.save()
    return user
}

exports.updateUser = async (id, data) => {
    return await User.findByIdAndUpdate(id, data, { returnDocument: 'after', runValidators: true })
}

exports.deleteUser = async (id) => {
    return await User.findByIdAndDelete(id)
}
exports.getUserById = async (id) => {
    return await User.findById(id)
}

exports.getUserByEmail = async (email) => {
    return await User.findOne({ email })
}

exports.getUserByTeam = async (teamId) => {
    return await User.find({ team: teamId })
}

exports.getUserByRole = async (role) => {
    return await User.find({ role })
}

exports.updatePassword = async (id, newPassword) => {
    return await User.findByIdAndUpdate(id, { password: newPassword }, { returnDocument: 'after', runValidators: true })
}

exports.updateAvatar = async (id, avatarUrl) => {
    return await User.findByIdAndUpdate(id, { avatar: avatarUrl }, { returnDocument: 'after', runValidators: true })
}

exports.getUserInformation = async (id) => {
    
    return await User.findById(id).populate('team', 'name').populate('managerId', 'name email')
}

exports.logoutUser = async (userId) => {
    return await User.findByIdAndUpdate(
        userId,
        { $unset: { refreshTokenHash: 1, refreshTokenExpiresAt: 1 } },
        { returnDocument: 'after' }
    );
};

exports.getAgents = async () => {
    return await User.find({ role: 'agent' }).select('-password -confirmPassword -refreshTokenHash');
};

exports.getUserByManager = async (managerId) => {
    return await User.find({ managerId })
}
