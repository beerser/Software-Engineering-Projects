const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  status: { type: String, default: 'available' },
  description: { type: String, default: "" }, // ✅ เพิ่ม description
  servicefee: { type: Number, default: 0 },    // ✅ เพิ่ม service fee
  image_urls: [String],  
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
});

const bookingSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  room_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
  slip_filename: { type: String },
  payment_status: { type: String, default: 'pending' },
  created_at: { type: Date, default: Date.now },
});

const Room = mongoose.model('Room', roomSchema);
const User = mongoose.model('User', userSchema);
const Booking = mongoose.model('Booking', bookingSchema);

module.exports = { Room, User, Booking };
