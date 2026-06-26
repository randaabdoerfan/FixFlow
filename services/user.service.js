const {
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    getUserByEmail,
    getUserByTeam,
    getUserByRole,
    getUserInformation,
    updatePassword,
    updateAvatar
} = require('../repositories/user.repo');
const AppError = require('../utilities/appError');
const bcrypt = require('bcrypt');


exports.getAllUsers = async () => {
    return await getAllUsers()
}

exports.getUserById = async (id) => {
    if (!id) { throw new AppError("no id please add the id", 400) }
    return await getUserById(id)
}

exports.updateUser = async (id, data) => {
    if (!id) { throw new AppError("no id please add the id", 400) }
    if (!data) { throw new AppError("no data", 400) }
    return await updateUser(id, data)
}

exports.deleteUser = async (id) => {
    if (!id) { throw new AppError("no id please add the id", 400) }
    return await deleteUser(id)
}

exports.getUserByEmail = async (email) => {
    if (!email) { throw new AppError("no email please add the email", 400) }
    return await getUserByEmail(email)
}

exports.getUserByTeam = async (teamId) => {
    if (!teamId) { throw new AppError("no team id please add the team id", 400) }
    return await getUserByTeam(teamId)
}

exports.getUserByRole = async (role) => {
    if (!role) { throw new AppError("no role please add the role", 400) }
    return await getUserByRole(role)
}

exports.getUserInformation = async (id) => {
    if (!id) { throw new AppError("no id please add the id", 400) }
    return await getUserInformation(id)
}

exports.updatePassword = async (id, oldPasssword,newPassword) => {
    if (!id) { throw new AppError("no id please add the id", 400) }
    if (!newPassword) { throw new AppError("no new password please add the new password", 400) }
    const user = await getUserById(id)
    if(oldPasssword){
        const isMatch = await bcrypt.compare(oldPasssword, user.password);
        if (!isMatch) { throw new AppError("old password is incorrect", 400) }
    }
    if (!user) { throw new AppError("user not found", 404) }
    const newPasswordHash = await bcrypt.hash(newPassword, 10);
    return await updatePassword(id, newPasswordHash)
}

exports.updateAvatar = async (id, avatarUrl) => {
    if (!id) { throw new AppError("no id please add the id", 400) }
    if (!avatarUrl) { throw new AppError("no avatar url please add the avatar url", 400) }
    return await updateAvatar(id, avatarUrl)
}

exports.getUserInformation = async (id) => {
    if (!id) { throw new AppError("no id please add the id", 400) }
    return await getUserInformation(id)
}