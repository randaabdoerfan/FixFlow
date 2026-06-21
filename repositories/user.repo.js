const User = require('../models/user.model');


exports.createUser = async (data) => {
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
    return await User.findByIdAndUpdate(id, { data }, { new: true })
}

exports.deleteUser = async (id) => {
    return await User.findByIdAndDelete(id)
}
exports.getUserByEmail = async (email) => {
    return await User.findOne({ email }).select('+password')
}

exports.getUserByTeam = async (teamId) => {
    return await User.find({ team: teamId })
}

exports.getUserByRole = async (role) => {
    return await User.find({ role: role })
}

exports.updatePassword = async (id, newPassword) => {
    return await User.findByIdAndUpdate(id, { password: newPassword }, { new: true })
}
exports.updateAvatar = async (id, avatarUrl) => {
    return await User.findByIdAndUpdate(id, { avatar: avatarUrl }, { new: true })
}

exports.getUserInformation = async (id) => {
    return await User.findById(id)
        .populate("name")
        .populate("email")
        .populate("role")
        .populate("team")
        .populate("phone")
        .populate("avatar")
}
