const express=require('express');
const router = express.Router();
const logController=require('../controllers/log.controller');

router.get('/getAll',logController.getAllLogs);
router.get('/ticket/:ticketId',logController.getLogsForTicket);
module.exports=router;