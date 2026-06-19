const mongoose = require('mongoose');
const teamMemberModel = require('./team-member.model');

const teamSchema = new mongoose.Schema({
   name:{
    enum:['IT','AI','HR','salse','managment','UI/UX','design','marketing','Frontend','Backend','testing','quality assurance']
   },
   number_of_team:{type:BigInt},
   managerId:{type:Schema.Types.ObjectId,ref:'teamMember'}
}, { timestamps: true })

module.exports = mongoose.model('teams', teamSchema);