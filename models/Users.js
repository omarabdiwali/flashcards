import mongoose, { Schema } from "mongoose";

let UserSchema = new Schema({
  name: String,
  email: String,
  cards: [{ id: String, folder: String, cards: Array, date: Date, public: Boolean }]
});

module.exports = mongoose.models.Users || mongoose.model("Users", UserSchema);