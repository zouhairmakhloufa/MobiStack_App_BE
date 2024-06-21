const mongoose = require("mongoose");

const CommentSchema = mongoose.Schema(
  {
    name: String,
    commentContent: {
      blocks: {
        type: Array,
        required: true,
        default: []
      },
      entityMap: {
        type: Object,
        required: true,
        default: {} // Ensures it's not undefined or null
      },
    },
    trusted: { type: Boolean, default: false },
    user_id: { type: String, ref: 'User' },
    question_id: { type: String, ref: 'Question' },
  },
  {
    minimize: false,
    timestamps: true,
  }
);

const Comment = mongoose.model("Comment", CommentSchema);
module.exports = Comment;