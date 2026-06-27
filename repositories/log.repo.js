const Log=require('../models/logs.model');
async function create(data) {
    return Log.create(data);
}
async function findAll({page=1,limit=20}={}){
    return Log.find()
    .populate('ticketId','title status')
    .populate('assignedTo','name email')
    .populate('client','name email')
    .sort({time:-1})
    .skip((page-1)*limit)
    .limit(limit);
}
async function findByTicketId(ticketId) {
    return Log.find({ticketId:ticketId})
    .populate('assignedTo','name email')
    .populate('client' ,'name email')
    .sort({time:-1})
}

module.exports={create ,findAll,findByTicketId};