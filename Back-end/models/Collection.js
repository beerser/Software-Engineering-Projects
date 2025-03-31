const mongoose = require("mongoose");

const collectionSchema = new mongoose.Schema({
  user_firstname: { type: String, required: true },
  user_lastname: { type: String, required: true },
  room_number: { type: String, required: true },
  invoice_filename: { type: String, required: true }
});

const Collection = mongoose.model("Collection", collectionSchema);

module.exports = Collection;
