const messageServices=require("../services/message.service")

exports.sendMessage=async(req,res,next)=>{
    try { 
        const result =await messageServices.sendMessage(req.body);

 const io = req.app.get("io");

if(io){
io.to(req.body.receiver.toString()).emit("newMessage", result.message);}
 io.to(req.body.receiver.toString()).emit(
            "newNotification",
            result.notification
        );
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