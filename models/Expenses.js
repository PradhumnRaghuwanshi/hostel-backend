const mongoose = require('mongoose');

const ExpensesSchema = new mongoose.Schema({
  cleaner : Number,
  maintainance : Number,
  water : Number,
  electricity: Number
});

module.exports = mongoose.model('Expenses', ExpensesSchema);
