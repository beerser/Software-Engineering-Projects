const mongoose = require('mongoose');

const moneySchema = new mongoose.Schema({
  price: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model('Money', moneySchema);
