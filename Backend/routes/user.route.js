const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

const {
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    getUserByEmail,
    getUserByTeam,
    getUserByRole,
    getUserByManagerId,
    updateAvatar,
    getUserCount,
    toggleUserStatus,
    getAgentsWithWorkload,
    getDashboardStats,
    getOnlineUsers
} = require('../controllers/user.controller');

const {
    registerUser,
    loginUser,
    verifyEmail,
    ChangePassword,
    resetPassword,
    confirmResetPassword,
    logoutUser,
    myProfile
} = require('../controllers/auth.controller');

const verifyToken      = require('../middleware/verifytoken.middleware');
const verifyRefreshToken = require('../middleware/verifyRefreshToken.middleware');
const authorize        = require('../middleware/authorize.middleware');
const { upload }       = require('../middleware/uploadfile.middleware');
const validate         = require('../middleware/vaildate.middleware');
const userValidator    = require('../validators/user.vaildator');

// Public Auth Routes 
router.post('/register', upload.single('avatar'), validate(userValidator), registerUser);
router.post('/login', loginUser);
router.get('/verify/:token', verifyToken('verify'), verifyEmail);
router.post('/resetpassword', resetPassword);
router.get('/resetpassword/:token', (req, res) => {
  const token = req.params.token;
  try {
    jwt.verify(token, process.env.SECERT_KEY);
  } catch {
    return res.redirect('http://localhost:3000/auth/login?reset=expired');
  }
  res.redirect(`http://localhost:3000/auth/resetpassword/${token}`);
});
router.post('/resetpassword/:token', verifyToken('reset'), confirmResetPassword);

// Authenticated Routes (any logged-in user) 
router.post('/logout',verifyToken('login'), logoutUser);
router.post('/changepassword',verifyToken('login'), ChangePassword);
router.get('/me',verifyToken('login'), myProfile);
router.put('/avatar/:id',verifyToken('login'), upload.single('avatar'), updateAvatar);

// Manager + Admin (static routes BEFORE dynamic :id)
router.get('/team/:team', verifyToken('login'), authorize('admin', 'manager'), getUserByTeam);
router.get('/role/:role', verifyToken('login'), authorize('admin', 'manager'), getUserByRole);
router.get('/by-manager/:managerId', verifyToken('login'), authorize('admin', 'manager'), getUserByManagerId);
router.get('/agents/workload', verifyToken('login'), authorize('admin', 'manager'), getAgentsWithWorkload);
router.get('/stats', verifyToken('login'), authorize('admin', 'manager'), getDashboardStats);
router.get('/online', verifyToken('login'), authorize('admin'), getOnlineUsers);
router.get('/all',          verifyToken('login'), authorize('admin'), getAllUsers);
router.get('/email/:email', verifyToken('login'), authorize('admin'), getUserByEmail);
router.get('/count',        verifyToken('login'), authorize('admin'), getUserCount);
router.post('/create',      verifyToken('login'), authorize('admin'), upload.single('avatar'), registerUser);
router.patch('/:id/status', verifyToken('login'), authorize('admin'), toggleUserStatus);
router.delete('/:id',       verifyToken('login'), authorize('admin'), deleteUser);

// User can view/edit their own profile (dynamic :id must be LAST)
router.get('/:id',  verifyToken('login'), getUserById);
router.put('/:id',  verifyToken('login'), updateUser);


module.exports = router;