const {createUser,
    loginUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    getUserByRole,
    getUserByEmail,
    getUserByTeam,
    getUserInformation,
    updateAvatar,
    updatePassword} = require('../services/user.service');

exports.registerUser = async (req, res) => {
    try {
        const avatar = req.file ? req.file.path : null;
        const userData = { ...req.body, avatar };
        const newUser = await createUser(userData);
        
        res.status(201).json({message:"User created successfully"},newUser);
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
        console.log(email,password)
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

exports.getAllUsers = async (req, res) => {
    try {
        const users = await getAllUsers();
        res.status(200).json(users);
    } catch (err) {

       res.status(400).json({
            success: false,
            message: err.message
        });
    }
};

exports.getUserById = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await getUserById(id);
        res.status(200).json(user);
    } catch (err) {

       res.status(400).json({
            success: false,
            message: err.message
        });
    }   
};

exports.updateUser = async (req, res) => {
    try {
        const id = req.params.id;
        const updatedUser = await updateUser(id, req.body);
        res.status(200).json(updatedUser);
    } catch (err) {
       res.status(400).json({
            success: false,
            message: err.message
        });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const id = req.params.id;
        await deleteUser(id);
        res.status(204).json();
    } catch (err) {

        res.status(400).json({
            success: false,
            message: err.message
        });
    }
};


exports.getUserByEmail = async (req, res) => {
    try {
        const email = req.params.email;
        const user = await getUserByEmail(email);
        res.status(200).json(user);
    } catch (err) {
       res.status(400).json({
            success: false,
            message: err.message
        });
    }
};

exports.getUserByTeam = async (req, res) => {
    try {
        const teamId = req.params.teamId;
        const users = await getUserByTeam(teamId);
        res.status(200).json(users);
    } catch (err) {
        res.status(400).json({
            success: false,
            message: err.message
        });
    }
};

exports.getUserByRole = async (req, res) => {
    try {
        const role = req.params.role;
        const users = await getUserByRole(role);
        res.status(200).json(users);
    } catch (err) {
       res.status(400).json({
            success: false,
            message: err.message
        });
    }
};

exports.getUserInformation = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await getUserInformation(id);
        res.status(200).json(user);
    } catch (err) {
        res.status(400).json({
            success: false,
            message: err.message
        });
    }
};

exports.updatePassword = async (req, res) => {
    try {
        const id = req.params.id;
        const { oldPassword, newPassword } = req.body;
        await updatePassword(id, oldPassword, newPassword);
        res.status(200).json({ message: 'Password updated successfully' });
    } catch (err) {
       res.status(400).json({
            success: false,
            message: err.message
        });
    }
};

exports.updateAvatar = async (req, res) => {
    try {
        const id = req.params.id;
        const avatar = req.file.path;
        await updateAvatar(id, avatar);
        res.status(200).json({ message: 'Avatar updated successfully' });
    } catch (err) {
       res.status(400).json({
            success: false,
            message: err.message
        });
    }
};
