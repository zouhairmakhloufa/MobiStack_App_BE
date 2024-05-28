const mongoose = require("mongoose");

const notificationSchema = mongoose.Schema(
  {
    user: { type: String, ref: 'User', required: true },
    user_added: { type: String, ref: 'User', required: true },
    type: { type: String, required: true },
    question_id: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }

  },
  {
    minimize: false,
    timestamps: true,
  }
);

const Notification = mongoose.model("Notification", notificationSchema);
module.exports = Notification;