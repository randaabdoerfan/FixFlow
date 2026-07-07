const messageServices=require("../services/message.service")
const ticketServices = require("../services/ticket.service")

exports.sendMessage=async(req,res,next)=>{
    try { 
        const result =await messageServices.sendMessage(req.body);

        let updatedTicket = null;
        if (req.body.ticket_id) {
            try {
                const ticket = await ticketServices.getTicketById(req.body.ticket_id);
                if (ticket && ticket.status === "assignedTo") {
                    const dummyUser = { userId: ticket.assignedTo?.toString(), role: "agent" };
                    updatedTicket = await ticketServices.changeStatus(req.body.ticket_id, "inProgress", dummyUser);
                }
            } catch (statusErr) {
                console.log("Auto inProgress failed:", statusErr.message);
            }
        }

 const io = req.app.get("io");

if(io){
io.to(req.body.receiver.toString()).emit("newMessage", result.message);
 io.to(req.body.receiver.toString()).emit(
            "newNotification",
            result.notification
        );
if (updatedTicket) {
    io.to(req.body.sender.toString()).emit("ticketAssigned", updatedTicket);
    io.to(req.body.receiver.toString()).emit("ticketAssigned", updatedTicket);
}}
  return  res.status(201).json({
        success:true,
        data:result.message
    })
        
    } catch (error) {
      
      next(error)
    }
 
}


exports.getMessageById=async(req,res,next)=>{

try {
    const message=await messageServices.getMessageById(req.params.id);
res.status(200).json({
    status:"success",
    data:message
})    
} catch (error) {
    next(error)
    
}

};


exports.markMessageAsSeen=async(req,res,next)=>{
    try {
        const message=await messageServices.markMessageAsSeen(req.params.id);
    return res.status(201).json({
    status:"success",
    data:message
    })
    } catch (error) {
        next(error)
        
    }
}


exports.deleteMessage = async (req, res, next) => {
    try {
        await messageServices.deleteMessage(req.params.id);

        res.status(200).json({
            status: "success",
            message: "Message deleted successfully"
        });
    } catch (err) {
        next(err);
    }
};

exports.getConversation = async (req, res, next) => {
    try {
        const { user1, user2 } = req.params;
        const messages = await messageServices.getConversation(user1, user2);
        res.status(200).json({
            success: true,
            data: messages,
        });
    } catch (err) {
        next(err);
    }
};
exports.getMessagesByTicket = async (req, res, next) => {
    try {
        const messages = await messageServices.getMessagesByTicket(
            req.params.ticketId
        );

        res.status(200).json({
            success: true,
            results: messages.length,
            data: messages,
        });
    } catch (err) {
        next(err);
    }
};