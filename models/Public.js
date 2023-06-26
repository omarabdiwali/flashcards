import mongoose, { Schema } from "mongoose";

let PublicSchema = new Schema({
  id: String,
  user: String,
  emails: [String],
  folder: String,
  cards: [],
  date: Date,
  public: Boolean
});

module.exports = mongoose.models.Public || mongoose.model("Public", PublicSchema);