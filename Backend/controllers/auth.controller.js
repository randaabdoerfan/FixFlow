const { RegisterUser, initiateReset, confirmReset, resetPassword, changePassword, verifyEmail, loginUser, logout } = require('../services/auth.service');
const generateToken = require('../utilities/genrateToken');
const generateRefreshToken = (user) => generateToken(user, 'refresh');
const AppError = require('../utilities/appError');
const { WelcomeAndSendVerifcation, changePasswordEmail, resetPasswordEmail } = require('../services/email.service');
const User = require("../models/user.model")

exports.registerUser = async (req, res) => {
    try {
        const avatar = req.file ? req.file.path : "https://res.cloudinary.com/dngkblgyf/image/upload/v1782397617/graduationProject/1782397603125.jpg.jpg"
        const userData = { ...req.body, avatar };
        const newUser = await RegisterUser(userData);
        const isAdminCreate = req.user && req.user.role === 'admin';
        if (!isAdminCreate) {
            try {
                const token = generateToken(newUser, 'verify');
                await WelcomeAndSendVerifcation(newUser.email, newUser.name, token);
            } catch (emailErr) {
                console.log('Email sending failed (user still created):', emailErr.message);
            }
        }
        if (isAdminCreate) {
            res.status(201).json({ message: "User created successfully", user: newUser });
        } else {
            res.status(201).json({ message: "Please check your email and verify your account before logging in.", user: newUser });
        }
    } catch (err) {
        console.log(err);
        res.status(400).json({ success: false, message: err.message });
    }
};

exports.verifyEmail = async (req, res) => {
    try {
        const id = req.user.userId;
        const user = await verifyEmail(id);

        const accessToken = generateToken(user, 'login');
        const refreshToken = generateRefreshToken(user);
        
        await user.save();

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.redirect(`http://localhost:3000/auth/login?verified=true&token=${accessToken}`);

    } catch (err) {
        console.log(err);
        res.redirect("http://localhost:3000/auth/login?verified=false");
    }
};

exports.loginUser = async (req, res) => {
    try {
        const user = await loginUser(req.body);

        const accessToken = generateToken(user, "login");
        const refreshToken = generateRefreshToken(user);

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.json({
            token: accessToken,
            user: user,
        });

    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

exports.myProfile = async (req, res) => {
    try {
        const userId = req.user.userId
        const user = await User.findById(userId).select('-password');

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const accessToken = generateToken(user, "login");

        res.json({
            token: accessToken,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                phone: user.phone,
            },
        });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};

exports.ChangePassword = async (req, res) => {
    try {
        // Get user ID from verified JWT token, not from URL params
        const userId = req.user.userId
        const { oldPassword, newPassword } = req.body;
        const updatedUser = await changePassword(userId, oldPassword, newPassword);
        await changePasswordEmail(updatedUser.email, updatedUser.name);
        res.status(200).json({ message: 'Password changed successfully', user: updatedUser });
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
        const userId = req.user.userId
        const newPassword = req.body.newPassword || req.body.password;
        if (!newPassword) {
            return res.status(400).json({ success: false, message: 'New password is required' });
        }
        await confirmReset(userId, newPassword);
        res.status(200).json({ message: "Password reset successfully" }); // ✅ removed broken redirect
    } catch (err) {
        console.log(err);
        res.status(400).json({ success: false, message: err.message });
    }
};

exports.logoutUser = async (req, res) => {
    try {
        console.log("Logout endpoint called");

        console.log("Token:", req.token);
        console.log("User:", req.user);

        if (!req.token) {
            return res.status(401).json({
                message: "Not authorized"
            });
        }

        await logout(req.user.userId);

        console.log("Logout service finished");

        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
        });

        return res.status(200).json({
            success: true,
            message: "Logged out successfully"
        });

    } catch (err) {
        console.error(err);

        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
};