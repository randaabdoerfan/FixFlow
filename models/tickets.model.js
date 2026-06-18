const mongoose = require('mongoose')

const ticketSchema = new mongoose.Schema({
    title: {
        type: String,
        minlength: [3, "title should not be less than 3 chars"],
        maxlength: [20, "title should not be more than 20 chars"],
        required: [true, "title is required"]
    },
    description: {
        type: String,
        minlength: [3, "title should not be less than 3 chars"],
        maxlength: [150, "title should not be more than 150 chars"],
        required: [true, "description is required"]
    },
    status: {
        type: String,
        required: [true, "status is required"],
        enum: ["opened", "assignedTo", "inProgress", "resolved", "closed"],
        default: "opened"
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "You should login first"]
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "teamMember"
    },
    teamLeader: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Team",
        required: [true, "you should assign team"]
    }
}, { timestamps: true })
module.exports = mongoose.model('Ticket', ticketSchema) 