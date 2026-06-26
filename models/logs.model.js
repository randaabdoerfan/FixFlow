const mongoose =require("mongoose")
const logsSchema=new mongoose.Schema({
    
    assignedTo:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
    },
    client:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true,
    },
    status:{
        type:String,
        required:true,
        enum: ["opened", "assignedTo", "inProgress", "resolved", "closed"],
    },
    time:{
        type:Date,
        default:Date.now,
    },
    ticketId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Ticket',
        required:true,
    },
})
module.exports=mongoose.model('Log',logsSchema)