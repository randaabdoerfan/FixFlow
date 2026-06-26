const { RegisterUser, initiateReset, confirmReset, resetPassword, changePassword, verifyEmail, loginUser, logout } = require('../services/auth.service');
const generateToken = require('../utilities/genrateToken');
const AppError = require('../utilities/appError');
const { WelcomeAndSendVerifcation, changePasswordEmail, resetPasswordEmail } = require('../services/email.service');
const { getUserByEmail, getUserById } = require('./user.controller');

exports.registerUser = async (req, res) => {
    try {

        const avatar = req.file ? req.file.path : "https://res.cloudinary.com/dngkblgyf/image/upload/ar_1:1,c_crop,g_auto:face,w_300/r_max/co_rgb:68D2E7,e_outline:outer:15/"
        const userData = { ...req.body, avatar };
        const newUser = await RegisterUser(userData);
        const token = generateToken(newUser, 'verify');
        await WelcomeAndSendVerifcation(newUser.email, newUser.name, token);
        res.status(201).json({ message: "User created successfully", user: newUser });
    } catch (err) {
        console.log(err);
        res.status(400).json({
            success: false,
            message: err.message
        });
    }
};
exports.verifyEmail = async (req, res) => {
    try {
        const id = req.user.userId

        const user = await verifyEmail(id);
        const accessToken = generateToken(user, 'login');
        const refreshToken = generateToken(user, 'refresh')
        user.refreshTokenHash = refreshToken;
        await user.save();
        // res.redirect(`http://localhost:3000/login?email=${user.email}?password=${user.password}`);
        res.status(200).json({ message: 'Email verified successfully', token: accessToken, refresh: refreshToken });
    } catch (err) {

        res.status(400).json({
            success: false,
            message: err.message
        });
    }
};
// exports.redirectLogin=async(req,res)=>{
//     const email = req.query.email
//     const user = await getUserByEmail(email)
//     const token = generateToken(newUser, 'login');
//     user.refreshTokenHash = token;
//     await user.save();
//     res.send("Login Page")
// }

exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await loginUser(req.body);
        const token = generateToken(user, 'login');
        const refreshToken = generateToken(user, 'refresh')
        user.refreshTokenHash = refreshToken;
        await user.save();
        res.cookie("refreshToken", refreshToken, {
            httponly: true,
            sceure: false,
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })
        res.status(200).json({ message: 'Login successful', user, token: token, refresh: refreshToken });

    } catch (err) {
        console.log(err);
        res.status(400).json({
            success: false,
            message: err.message
        });
    }
};

exports.ChangePassword = async (req, res) => {
    try {
        // const id = req.user.userId;
        const id = req.params.id
        const { oldPassword, newPassword } = req.body;
        // const user = await getUserById(id);
        const updatedUser = await changePassword(id, oldPassword, newPassword);
        await changePasswordEmail(updatedUser.email, updatedUser.name)
        res.status(200).json({ message: 'Password changed successfully', updatedUser });
    } catch (err) {
        console.log(err);
        res.status(400).json({
            success: false,
            message: err.message
        })
    }
};
exports.resetPassword = async (req, res) => {
    try {
        const email = req.body.email
        const user = await initiateReset(email);
        const token = generateToken(user, 'reset')
        await resetPasswordEmail(user.email, user.name, token)
        res.status(200).json({ message: 'If this email exists, a reset link has been sent.' });


    } catch (err) {
        console.log(err);
        res.status(400).json({
            success: false,
            message: err.message
        });
    }
}
exports.confirmResetPassword = async (req, res) => {
    try {
        const id = req.user.userId
        const newPassword = req.body.newPassword
        await confirmReset(id, newPassword)
        res.status(200).json({ message: "Password reset successfully" })

    } catch (err) {
        console.log(err);
        res.status(400).json({ success: false, message: err.message });
    }
}

exports.logout = async (req, res) => {
    try {

        const userId = req.user.userId;

        await logout(userId);


        res.clearCookie("refreshToken");

        return res.status(200).json({
            success: true,
            message: "Logged out successfully"
        });

    } catch (err) {

        return res.status(
            err.statusCode || 500
        ).json({
            success: false,
            message: err.message
        });
    }
};

