const Trip = require('../models/Trip');

// @desc    Tüm seyahatleri getir
// @route   GET /api/trips
// @access  Private
const getTrips = async (req, res) => {
  try {
    const trips = await Trip.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(trips);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Tek seyahat getir
// @route   GET /api/trips/:id
// @access  Private
const getTripById = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);

    if (trip && trip.user.toString() === req.user._id.toString()) {
      res.json(trip);
    } else {
      res.status(404).json({ message: 'Trip not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Yeni seyahat oluştur
// @route   POST /api/trips
// @access  Private
const createTrip = async (req, res) => {
  try {
    const { destination, startDate, endDate, totalBudget, categoryBudgets, currency } = req.body;

    const trip = await Trip.create({
      user: req.user._id,
      destination,
      startDate,
      endDate,
      totalBudget,
      categoryBudgets,
      currency
    });

    res.status(201).json(trip);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Seyahat güncelle
// @route   PUT /api/trips/:id
// @access  Private
const updateTrip = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);

    if (trip && trip.user.toString() === req.user._id.toString()) {
      trip.destination = req.body.destination || trip.destination;
      trip.startDate = req.body.startDate || trip.startDate;
      trip.endDate = req.body.endDate || trip.endDate;
      trip.totalBudget = req.body.totalBudget || trip.totalBudget;
      trip.categoryBudgets = req.body.categoryBudgets || trip.categoryBudgets;
      trip.currency = req.body.currency || trip.currency;

      const updatedTrip = await trip.save();
      res.json(updatedTrip);
    } else {
      res.status(404).json({ message: 'Trip not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Seyahat sil
// @route   DELETE /api/trips/:id
// @access  Private
const deleteTrip = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);

    if (trip && trip.user.toString() === req.user._id.toString()) {
      await trip.deleteOne();
      res.json({ message: 'Trip removed' });
    } else {
      res.status(404).json({ message: 'Trip not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Harcama ekle
// @route   POST /api/trips/:id/expenses
// @access  Private
const addExpense = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);

    if (trip && trip.user.toString() === req.user._id.toString()) {
      const { category, amount, description, date } = req.body;

      trip.expenses.push({ category, amount, description, date });
      await trip.save();

      res.status(201).json(trip);
    } else {
      res.status(404).json({ message: 'Trip not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Harcama sil
// @route   DELETE /api/trips/:id/expenses/:expenseId
// @access  Private
const deleteExpense = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);

    if (trip && trip.user.toString() === req.user._id.toString()) {
      trip.expenses = trip.expenses.filter(
        expense => expense._id.toString() !== req.params.expenseId
      );
      await trip.save();
      res.json(trip);
    } else {
      res.status(404).json({ message: 'Trip not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getTrips,
  getTripById,
  createTrip,
  updateTrip,
  deleteTrip,
  addExpense,
  deleteExpense
};