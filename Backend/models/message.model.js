const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    ticket_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ticket',
        // required: true
    },
    body: {
        type: String,
        required: true
    },
    is_been_seen: {
        type: Boolean,
        default: false
    },
    
}, 
{ timestamps: true });
module.exports = mongoose.model('Message', messageSchema);