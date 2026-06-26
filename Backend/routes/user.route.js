
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

const { registerUser, loginUser,verifyEmail,ChangePassword,resetPassword ,confirmResetPassword,redirectLogin} = require('../controllers/auth.controller');
const verifyToken = require('../middleware/verifytoken.middleware');
const { upload } = require('../middleware/uploadfile.middleware');

const validate = require('../middleware/vaildate.middleware');
const userValidator = require('../validators/user.vaildator')

router.post('/register', upload.single('avatar'),validate(userValidator), registerUser); //register
router.get('/verify/:token', verifyToken('verify'),verifyEmail); //verify email
router.post('/changepassword', verifyToken('login'), ChangePassword);  //change password
// router.post('/changepassword/:id',ChangePassword);
router.post('/resetpassword',resetPassword); //reset password
router.post('/resetpassword/:token', verifyToken('reset'), confirmResetPassword);
// router.get('/resetpassword/:token',verifyToken('reset'),resetPassword); //reset password
// router.get('/redirect',verifyToken('login'),redirectLogin)

router.post('/login', loginUser); //login
router.get('/all', getAllUsers); //get all users
router.get('/:id', getUserById); //get user by id
router.put('/:id', updateUser); //update user
router.delete('/:id', deleteUser); //delete user
router.get('/team/:team', getUserByTeam);
router.put('/avatar/:id', upload.single('avatar'), updateAvatar);

module.exports = router;

