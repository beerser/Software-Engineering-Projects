const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user_firstname: { type: String, required: true },
  user_lastname: { type: String, required: true },
  room_number: { type: String, required: true },
  slip_filename: { type: String, required: true },
  invoice_filename: { type: String },
  payment_status: { type: String, default: 'pending' },
  created_at: { type: Date, default: Date.now },
  
});

const Booking = mongoose.model('Booking', bookingSchema);  // สร้างโมเดล Booking

module.exports = Booking;  // ส่งออกโมเดลเพื่อใช้ในไฟล์อื่นๆ
