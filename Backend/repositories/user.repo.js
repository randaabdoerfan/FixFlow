const User = require('../models/user.model');
const Team = require('../models/teams.model');

exports.createUser = async (data) => {
    const team = await Team.findOne({ _id: data.team });
    const teamId = team ? team._id : null;
    data.team = teamId;
    return await User.create(data)
}
exports.loginUser = async (data) => {
    return await User.findOne({ email: data.email })
}
exports.getAllUsers = async () => {
    return await User.find()
}

exports.getUserById = async (id) => {
    return await User.findById(id)
}
exports.updateUser = async (id, data) => {
    return await User.findByIdAndUpdate(id, data, { returnDocument: 'after', runValidators: true })
}

exports.deleteUser = async (id) => {
    return await User.findByIdAndDelete(id)
}
exports.getUserByEmail = async (email) => {
    return await User.findOne({ email:email })
}

exports.getUserByTeam = async (teamId) => {
    return await User.find({ team: teamId })
}

exports.getUserByRole = async (role) => {
    return await User.find({ role: role })
}

exports.updatePassword = async (id, newPassword) => {
    return await User.findByIdAndUpdate(id, { password: newPassword }, { returnDocument: 'after', runValidators: true })
}
exports.updateAvatar = async (id, avatarUrl) => {
    return await User.findByIdAndUpdate(id, { avatar: avatarUrl }, { returnDocument: 'after', runValidators: true })
}

exports.getUserInformation = async (id) => {
    return await User.findById(id)
        .populate("name")
        .populate("email")
        .populate("role")
        .populate("phone")
        .populate("avatar")
}
exports.logoutUser = async (userId) => {
    return await User.findByIdAndUpdate(
        userId,
        {
            $unset: {
                refreshTokenHash: 1,
                refreshTokenExpiresAt: 1
            }
        },
        { new: true }
    );
};
