const Log=require('../models/logs.model')
async function logStatusChange({ticketId,status,assignedTo,client}) {
    try{
        await Log.create({ticketId,status,assignedTo,client});
    }catch(err){
        console.error(`[logService] Failed to log ticket ${ticketId}:`,err.message);
    }
}
module.exports={logStatusChange};