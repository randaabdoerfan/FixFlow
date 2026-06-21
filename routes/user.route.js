
const express = require('express');
const router = express.Router();
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
    updateAvatar } = require('../controllers/user.controller');

const { registerUser, loginUser } = require('../controllers/auth.controller');
const { upload } = require('../middleware/uploadfile.middleware');
const validate = require('../middleware/vaildate.middleware');
router.post('/register', upload.single('avatar'), registerUser); //register
router.post('/login', loginUser); //login
router.get('/all', getAllUsers); //get all users
router.get('/:id', getUserById); //get user by id
router.put('/:id', updateUser); //update user
router.delete('/:id', deleteUser); //delete user
router.get('/team/:team', getUserByTeam);
router.put('/password/:id', updatePassword);
router.put('/avatar/:id', upload.single('avatar'), updateAvatar);

module.exports = router;

