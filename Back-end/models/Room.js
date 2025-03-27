const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  room_number: String,
  price: Number,
  status: String,
  description: String,
  image_url: String
});

module.exports = mongoose.model('Room', roomSchema);