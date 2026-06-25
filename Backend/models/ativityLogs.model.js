const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema(
  {
    ticketId: { type: mongoose.Schema.Types.ObjectId, ref: 'Ticket', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    action: {
      type: String,
      enum: [
        'created',
        'updated',
        'status_changed',
        'assigned',
        'unassigned',
        'commented',
        'attachment_added',
        'resolved',
        'closed',
      ],
      required: true,
    },
    description: { type: String, default: '' },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

activityLogSchema.index({ ticketId: 1, createdAt: -1 });

module.exports = mongoose.model('ActivityLog', activityLogSchema);
