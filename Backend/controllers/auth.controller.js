const { RegisterUser, resetPassword, changePassword, verifyEmail, loginUser } = require('../services/auth.service');
const generateToken = require('../utilities/genrateToken');
const AppError = require('../utilities/appError');
const { WelcomeAndSendVerifcation, changePasswordEmail, resetPasswordEmail } = require('../services/email.service');
const { getUserByEmail } = require('./user.controller');

exports.registerUser = async (req, res) => {
    try {
        const avatar = req.file ? req.file.path : null;
        const userData = { ...req.body, avatar };
        const newUser = await RegisterUser(userData);
        const token = generateToken(newUser, 'verify');
        await WelcomeAndSendVerifcation(newUser.email, newUser.name, token);
        res.status(201).json({ message: "User created successfully" }, newUser);
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
        console.log(req.user)
        const user = await verifyEmail(id);
        const accessToken = generateToken(user, 'login');
        await user.save();
        const refreshToken = generateToken(user, 'refresh')
        user.refreshTokenHash = refreshToken;
        await user.save();
        // res.redirect(`http://localhost:3000/redirect?email=${user.email}`);
        res.status(200).json({ message: 'Email verified successfully', user, token:accessToken, refresh:refreshToken });
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

exports.ChangePassword = async (req, res) => {
    try {
        const id = req.user.userId;
        const { oldPassword, newPassword } = req.body;
        const user = await verifyEmail(id);
        const updatedUser = await changePassword(id, oldPassword, newPassword);
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
        const user = await resetPassword(email)
        const token = generateToken(user, 'reset')
        await resetPasswordEmail(user.email, user.name, token)
        res.json({ message: 'reset password successfuly', token, user })


    } catch (err) {
        console.log(err);
        res.status(400).json({
            success: false,
            message: err.message
        });
    }
}

exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await loginUser(req.body);
        const token = generateToken(user, 'login');
        const refreshToken = generateToken(user, 'refresh')
        user.refreshTokenHash = refreshToken;
        await user.save();
        res.status(200).json({ message: 'Login successful',  user ,token:token,refresh:refreshToken});
    } catch (err) {
        console.log(err);
        res.status(400).json({
            success: false,
            message: err.message
        });
    }
};