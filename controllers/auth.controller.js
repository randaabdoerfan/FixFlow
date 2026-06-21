const { createUser, getUserByEmail } = require('../services/auth.service');
const generateToken = require('../utilities/genrateToken');
const AppError = require('../utilities/appError');

exports.registerUser = async (req, res) => {
    try {
        const avatar = req.file ? req.file.path : null;
        const userData = { ...req.body, avatar };
        const newUser = await createUser(userData);
        res.status(201).json({ message: "User created successfully" }, newUser);
    } catch (err) {
        console.log(err);
        res.status(400).json({
            success: false,
            message: err.message
        });
    }
};
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(email, password)
        const user = await getUserByEmail(email);
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
        const token = generateToken(user);
        user.userToken = token;
        await user.save();
        res.status(200).json({ message: 'Login successful', token });
    } catch (err) {
        console.log(err);
        res.status(400).json({
            success: false,
            message: err.message
        });
    }
};