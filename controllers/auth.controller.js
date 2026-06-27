const { RegisterUser, initiateReset, confirmReset, resetPassword, changePassword, verifyEmail, loginUser, logout } = require('../services/auth.service');
const generateToken = require('../utilities/genrateToken');
const AppError = require('../utilities/appError');
const { WelcomeAndSendVerifcation, changePasswordEmail, resetPasswordEmail } = require('../services/email.service');

exports.registerUser = async (req, res) => {
    try {
        const avatar = req.file ? req.file.path : "https://res.cloudinary.com/dngkblgyf/image/upload/ar_1:1,c_crop,g_auto:face,w_300/r_max/co_rgb:68D2E7,e_outline:outer:15/"
        const userData = { ...req.body, avatar };
        const newUser = await RegisterUser(userData);
        const token = generateToken(newUser, 'verify');
        await WelcomeAndSendVerifcation(newUser.email, newUser.name, token);
        res.status(201).json({ message: "Please check your email and verify your account before logging in.", user: newUser });
    } catch (err) {
        console.log(err);
        res.status(400).json({ success: false, message: err.message });
    }
};

exports.verifyEmail = async (req, res) => {
    try {
        const id = req.user.userId;
        const user = await verifyEmail(id);
        const Token = generateToken(user, 'login');
        const refreshToken = generateToken(user, 'refresh');
        user.refreshTokenHash = refreshToken;
        await user.save();
        res.redirect(`http://localhost:3000/auth/login?verified=true&token=${Token}`);

        res.status(200).json({ message: 'Email verified successfully',user:user });
    } catch (err) {
        res.redirect("http://localhost:3000/login?verified=false");
        res.status(400).json({ success: false, message: err.message });
    }
};

exports.loginUser = async (req, res) => {
    try {
        const user = await loginUser(req.body);
        const token = generateToken(user, 'login');
        const refreshToken = generateToken(user, 'refresh');
        user.refreshTokenHash = refreshToken;
        await user.save();
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        res.cookie("Token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 15 * 60 * 1000
        });
        res.status(200).json({ message: 'Login successful', user:user ,token:token});
    } catch (err) {
        console.log(err);
        res.status(400).json({ success: false, message: err.message });
    }
};

exports.ChangePassword = async (req, res) => {
    try {
        // Get user ID from verified JWT token, not from URL params
        const id = req.user.userId;
        const { oldPassword, newPassword } = req.body;
        const updatedUser = await changePassword(id, oldPassword, newPassword);
        await changePasswordEmail(updatedUser.email, updatedUser.name);
        res.status(200).json({ message: 'Password changed successfully', user:updatedUser });
    } catch (err) {
        console.log(err);
        res.status(400).json({ success: false, message: err.message });
    }
};

exports.resetPassword = async (req, res) => {
    try {
        const email = req.body.email;
        const user = await initiateReset(email);
        const token = generateToken(user, 'reset');
        await resetPasswordEmail(user.email, user.name, token);
        res.status(200).json({ message: 'If this email exists, a reset link has been sent.' });
    } catch (err) {
        console.log(err);
        res.status(400).json({ success: false, message: err.message });
    }
};

exports.confirmResetPassword = async (req, res) => {
    try {
        const id = req.user.userId;
        const newPassword = req.body.newPassword;
        await confirmReset(id, newPassword);
        res.status(200).json({ message: "Password reset successfully" });
    } catch (err) {
        console.log(err);
        res.status(400).json({ success: false, message: err.message });
    }
};

exports.logout = async (req, res) => {
    try {
        const userId = req.user.userId;
        await logout(userId);
        res.clearCookie("refreshToken");
        return res.status(200).json({ success: true, message: "Logged out successfully" });
    } catch (err) {
        return res.status(err.statusCode || 500).json({ success: false, message: err.message });
    }
};
