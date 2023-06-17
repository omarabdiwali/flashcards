import mongoose, { Schema } from "mongoose";

let UserSchema = new Schema({
  name: String,
  email: String,
  cards: [{ folder: String, cards: Array, date: Date }]
});

module.exports = mongoose.models.Users || mongoose.model("Users", UserSchema);