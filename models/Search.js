import mongoose, { Schema } from "mongoose";

let SearchSchema = new Schema({
  word: String,
  matches: Map
});

module.exports = mongoose.models.Search || mongoose.model("Search", SearchSchema);