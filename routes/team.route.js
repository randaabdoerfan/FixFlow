const router = require('express').Router();
const teamController = require('../controllers/team.controller');
const validate = require('../middleware/vaildate.middleware');
const { createTeamSchema, updateTeamSchema } = require('../validators/team.validator');


router.post('/createTeam',  validate(createTeamSchema), teamController.createTeam);
router.get('/getAllTeams', teamController.getAllTeams);
router.get('/getTeam/:id', teamController.getTeam);
router.put('/updateTeam/:id', validate(updateTeamSchema), teamController.updateTeam);
router.delete('/deleteTeam/:id', teamController.deleteTeam);

module.exports = router;