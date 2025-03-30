const mongoose = require("mongoose");

const incomeSchema = new mongoose.Schema({
    month: { type: String, required: true },
    income: { type: Number, required: true },
    year: { type: Number, required: true },
  });

const Income = mongoose.model("Income", incomeSchema);  // สร้าง Model สำหรับ Income

module.exports = Income;
