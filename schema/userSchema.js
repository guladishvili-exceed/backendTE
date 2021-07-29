const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: String,
  surname: String,
  email: { type: String, unique: "That email is already taken" },
  password: String,
  username: String,
  age: Number,
  gender: String,
  onlineStatus: Boolean,
  lastOnline: Date,
  chosenPlan: Object,
});

const User = mongoose.model("User", UserSchema);
module.exports = User;
