const mongoose = require('mongoose');


const teamSchema = new mongoose.Schema({
   name:{type:String,
   required:[true,"team name is required"],
   trim:true
   },
   number_of_team:{type:Number, default:0},
   managerId:{type:mongoose.Schema.Types.ObjectId,ref:'User'}
}, { timestamps: true })

module.exports = mongoose.model('teams', teamSchema);