const mongoose = require('mongoose');


const teamSchema = new mongoose.Schema({
   name:{type:String,
   required:[true,"team name is required"],
   trim:true,
    enum:['IT','AI','HR','salse','managment','UI/UX','design','marketing','Frontend','Backend','testing','quality assurance']
   },
   number_of_team:{type:BigInt},
   managerId:{type:mongoose.Schema.Types.ObjectId,ref:'User'}
}, { timestamps: true })

module.exports = mongoose.model('teams', teamSchema);