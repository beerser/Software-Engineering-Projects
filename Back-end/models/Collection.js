const mongoose = require("mongoose");

const collectionSchema = new mongoose.Schema({
  user_firstname: String,
  user_lastname: String,
  room_number: String,
  invoice_filename: String,
});

const Collection = mongoose.model("Collection", collectionSchema);

module.exports = Collection;
