const mongoose = require('mongoose');

const notificationSchema  = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    message: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message'
    },
    body: {
        type: String
    },
    is_seen: {
        type: Boolean,
        default: false
    },
    
},
{ timestamps: true }
);
module.exports = mongoose.model('Notification', notificationSchema);