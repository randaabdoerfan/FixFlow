
const express = require('express');
const router = express.Router();
const {registerUser,
    loginUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    getUserByEmail,
    getUserByTeam,
    getUserByRole,
    getUserInformation,
    updatePassword,
    updateAvatar} = require('../controllers/user.controller');
const {upload} = require('../middleware/uploadfile.middleware');

router.post('/register',upload.single('avatar'), registerUser); //register
router.post('/login', loginUser); //login
router.get('/all', getAllUsers); //get all users
router.get('/:id', getUserById); //get user by id
router.get('/email/:email', getUserByEmail); //get user by email
router.put('/:id', updateUser); //update user
router.delete('/:id', deleteUser); //delete user
router.get('/team/:team', getUserByTeam);
router.get('/information/:id', getUserInformation);
router.put('/password/:id', updatePassword);
router.put('/avatar/:id', updateAvatar); 

module.exports = router;

