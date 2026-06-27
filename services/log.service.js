const logRepository=require('../repositories/log.repo');
async function getAllLogs(query) {
    return logRepository.findAll(qurey);
}
async function getLogsForTicket(ticketId) {
    return logRepository.findByTicketId(ticketId);
}
module.exports={getAllLogs,getLogsForTicket};