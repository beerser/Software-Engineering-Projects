const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  room_number: String,
  price: Number,
  servicefee: Number, 
  status: String,
  description: String,
  image_urls: [String],
});

module.exports = mongoose.model('Room', roomSchema);