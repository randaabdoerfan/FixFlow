
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
    updateAvatar} = require('../controllers/user.controller');

const { registerUser, loginUser,verifyEmail,ChangePassword,resetPassword ,redirectLogin} = require('../controllers/auth.controller');
const { upload } = require('../middleware/uploadfile.middleware');
const validate = require('../middleware/vaildate.middleware');
const verifyToken = require('../middleware/verifytoken.middleware');


router.post('/register', upload.single('avatar'), registerUser); //register
router.get('/verify/:token', verifyToken('verify'),verifyToken('refresh') ,verifyEmail); //verify email
router.post('/changepassword/:id',ChangePassword); //change password
router.post('/rersetpassword',verifyToken('reset'),resetPassword); //reset password
// router.get('/redirect',verifyToken('login'),redirectLogin)

router.post('/login', loginUser); //login
router.get('/all', getAllUsers); //get all users
router.get('/:id', getUserById); //get user by id
router.put('/:id', updateUser); //update user
router.delete('/:id', deleteUser); //delete user
router.get('/team/:team', getUserByTeam);
router.put('/avatar/:id', upload.single('avatar'), updateAvatar);

module.exports = router;

