const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    firstName: String ,
    lastName:  String ,
    avatar:  String ,
    email: { type: String,  unique: true, required: true },
    password: { type: String, required:true},
    role: { type: String, required:true },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);
module.exports = User;