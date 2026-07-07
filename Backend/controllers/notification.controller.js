const notificationService=require("../services/notification.service")
exports.createNotification=async(req,res,next)=>{
    try{
    const notification =await notificationService.createNotification(req.body);
      const io = req.app.get("io");
      if (io) io.to(req.body.user.toString()).emit("newNotification", notification);

    res.status(201).json({
        success:true,
        data:notification
    })

    
    }catch(err){
        next(err)
    }

}

exports.getUserNotifications=async(req,res,next)=>{
    try {
        const notification=await notificationService.getUserNotifications(req.params.userId);
        res.status(200).json({
            success:true,
            data:notification
        })
        
    } catch (error) {
        next(error)
    }
}
exports.getUnreadNotifications=async(req,res,next)=>{
    try {
        const notification=await notificationService.getUnreadNotifications(req.params.userId);
        res.status(200).json({
            success:true,
            data:notification
        })
        
    } catch (error) {
        next(error)
    }
}

exports.markNotificationAsSeen=async(req,res,next)=>{
    try {
        const notification=await notificationService.markNotificationAsSeen(req.params.id);
         res.status(200).json({
            success:true,
            data:notification
        })
    } catch (error) {
        next(error);
        
    }

}


exports.markAllAsSeen = async (req, res, next) => {
    try {
        await notificationService.markAllAsSeen(req.params.userId);

        res.status(200).json({
            success: true,
            message: "All notifications marked as seen"
        });
    } catch (err) {
        next(err);
    }
};

exports.deleteNotification = async (req, res, next) => {
    try {
        await notificationService.deleteNotification(req.params.id);

        res.status(200).json({
            success: true,
            message: "Notification deleted successfully"
        }); } catch (err) {
        next(err);
    }
};