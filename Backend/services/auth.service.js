const { createUser, loginUser } = require('../repositories/user.repo');
const { getUserByEmail, getUserById } = require('../repositories/user.repo');
const AppError = require('../utilities/appError');
const generateToken = require('../utilities/genrateToken');
exports.RegisterUser = async (data) => {
    if (!data) { throw new AppError("no data", 400) }
    const user = await getUserByEmail(data.email)
    if (user) {
        throw new AppError("Email already exists", 400);
    }
    if (data.password !== data.confirmPassword) {
        throw new AppError("Password and confirm password do not match", 400);
    }
    return await createUserRepo(data)
}

exports.verifyEmail = async (userid) => {
    if (!userid) { throw new AppError("no user id please add the user id", 400) }
    const user = await getUserById(userid);
    user.isEmailVerified = true;
    await user.save();
    return await user;
}
exports.changePassword = async (id, oldPassword, newPassword) => {
    if (!id) { throw new AppError("no id please add the id", 400) }
    const user = await getUserById(id);
    if (!user) { throw new AppError("Invail email or User not found", 400) }
    const isMatch = await user.comparePassword(oldPassword);
    if (!isMatch) {
        throw new AppError("Sorry, Wrong Password", 400);
    }
    user.password = newPassword;
    await user.save();
    return await user;
}
exports.resetPassword = async (email) => {
    if (!email) { throw new AppError("Please enter your email", 400) }
    const user = await getUserByEmail(email)
    if (!user) { throw new AppError("Invail email or User not found", 400) }
    return await user
}

exports.loginUser = async (data) => {
    const user = await loginUser(data);
    if (!user) { throw new AppError("Invalid email or password", 400); }
    const isMatch = await user.comparePassword(data.password);
    if (!isMatch) { throw new AppError("Invalid email or password", 400); }
    console.log("user", user);
    if (!user.isEmailVerified) { throw new AppError("Please verify your email before logging in", 400); }
    return await user
}

