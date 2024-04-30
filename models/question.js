const mongoose = require("mongoose");

const QestionSchema = mongoose.Schema(
  {
    name: String,
    type: String,
    user_id:{type:String , ref:'User'},
    questionContent: {
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
  },
  {
    minimize: false,
    timestamps: true,
  }
);

const Question = mongoose.model("Question", QestionSchema);
module.exports = Question;