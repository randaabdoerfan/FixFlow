const mongoose = require('mongoose');

const teamMemberSchema = new mongoose.Schema({

    name: {type:String,
        required:[true , 'name is required'],
        minLength:[3 , 'name must be at least 3 characters'],
        maxLength:[30 , 'name max length is 30'],
    },
    email : {type:String ,
        required :[true, 'email is required'],
        unique:true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email format'],
    },
    password : {type:String,
        required:true },
    teamId:{
        type:Schema.Types.ObjectId , ref:'teams',
        required:[true,'team is required']
    },
    isConnected:{Boolean , default:false},
    socketId:{type:String},
    role:{enum:['manager','member'],default:'member'},
    managerId:{type:Schema.Types.ObjectId , ref:'teamMember'}

}
 ,{timestamps:true});

module.exports = mongoose.model('teamMember', teamMemberSchema);