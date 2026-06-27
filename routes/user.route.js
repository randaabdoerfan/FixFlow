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
    updateAvatar
} = require('../controllers/user.controller');

const { registerUser, loginUser, verifyEmail, ChangePassword, resetPassword, confirmResetPassword } = require('../controllers/auth.controller');
const verifyToken = require('../middleware/verifytoken.middleware');
const { upload } = require('../middleware/uploadfile.middleware');
const validate = require('../middleware/vaildate.middleware');
const userValidator = require('../validators/user.vaildator');

router.post('/register', upload.single('avatar'), validate(userValidator), registerUser);
router.get('/verify/:token', verifyToken('verify'), verifyEmail);
router.post('/changepassword', verifyToken('login'), ChangePassword);
router.post('/resetpassword', resetPassword);
router.post('/resetpassword/:token', verifyToken('reset'), confirmResetPassword);
router.post('/login', loginUser);
router.post('/logout', verifyToken('login'), (req, res, next) => {

    require('../controllers/auth.controller').logout(req, res, next);
});

router.get('/all', getAllUsers);
router.get('/email/:email', getUserByEmail);
router.get('/team/:team', getUserByTeam);
router.get('/role/:role', getUserByRole);
router.put('/avatar/:id', upload.single('avatar'), updateAvatar);
router.get('/:id', getUserById);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

module.exports = router;
