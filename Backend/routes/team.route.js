const router = require('express').Router();
const teamController = require('../controllers/team.controller');
const validate = require('../middleware/vaildate.middleware');
const { createTeamSchema, updateTeamSchema } = require('../validators/team.validator');
const verifyToken = require('../middleware/verifytoken.middleware');
const authorize = require('../middleware/authorize.middleware');

router.post('/createTeam', verifyToken('login'), authorize('admin'), validate(createTeamSchema), teamController.createTeam);
router.get('/getAllTeams', verifyToken('login'), teamController.getAllTeams);
router.get('/getTeam/:id', verifyToken('login'), teamController.getTeamById);
router.put('/updateTeam/:id', verifyToken('login'), authorize('admin'), validate(updateTeamSchema), teamController.updateTeam);
router.delete('/deleteTeam/:id', verifyToken('login'), authorize('admin'), teamController.deleteTeam);

module.exports = router;