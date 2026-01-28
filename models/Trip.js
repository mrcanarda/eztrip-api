const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
    enum: ['Accommodation', 'Food', 'Transportation', 'Activities', 'Shopping', 'Other']
  },
  amount: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    trim: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const tripSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  destination: {
    type: String,
    required: [true, 'Please add a destination'],
    trim: true
  },
  startDate: {
    type: Date,
    required: [true, 'Please add a start date']
  },
  endDate: {
    type: Date,
    required: [true, 'Please add an end date']
  },
  totalBudget: {
    type: Number,
    required: [true, 'Please add a total budget'],
    min: 0
  },
  categoryBudgets: {
    accommodation: { type: Number, default: 0 },
    food: { type: Number, default: 0 },
    transportation: { type: Number, default: 0 },
    activities: { type: Number, default: 0 },
    shopping: { type: Number, default: 0 },
    other: { type: Number, default: 0 }
  },
  expenses: [expenseSchema],
  currency: {
    type: String,
    default: 'USD'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Toplam harcamayı hesapla
tripSchema.virtual('totalExpenses').get(function() {
  return this.expenses.reduce((total, expense) => total + expense.amount, 0);
});

module.exports = mongoose.model('Trip', tripSchema);