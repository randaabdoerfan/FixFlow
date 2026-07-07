const mongoose = require('mongoose')

const documentSchema = new mongoose.Schema({
    sender:{type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "You should login first"]},
    receiver:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        required:[true,"you should assigned this document to "]},
    file_url:{type:Array},
    ticket_id:{type:mongoose.Schema.Types.ObjectId, ref: "Ticket" }
    // required:[true,"ticket should be selected"]
}, { timestamps: true })
module.exports = mongoose.model('Document',documentSchema)