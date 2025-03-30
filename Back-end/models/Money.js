const mongoose = require('mongoose');

const moneySchema = new mongoose.Schema({
  price: Number,
});

module.exports = mongoose.model('Money', moneySchema);