const mongoose = require("mongoose");

const QestionSchema = mongoose.Schema(
  {
    name: String,
    type: String,
    user_id:{type:String , ref:'User'},
    questionContent: Object,
  },
  {
    timestamps: true,
  }
);

const Question = mongoose.model("Question", QestionSchema);
module.exports = Question;