const Log =require('../models/logs.model');
const logService=require('../services/log.service')
exports.getAllLogs=async(req,res)=>{
    try{
        const page=parseInt(req.query.page)||1;
        const limit =parseInt(req.query.limit) ||20;
        const logs= await logService.getAllLogs({page,limit});
        res.json(logs);
    }catch(err){
        res.status(500).json({
            error:err.message
        });
    }
}
exports.getLogsForTicket=async(req,res)=>{
    try{
        const logs=await logService.getLogsForTicket(req.params.ticketId);
        res.json(logs);
    }catch(err){
        res.status(500).json({
            error:err.message
        });
    }
}
