const express = require('express');  
const router = express.Router(); 

const {
    getTrips,
    getTripById,
    createTrip,
    updateTrip,
    deleteTrip,
    addExpense,
    deleteExpense
  
} = require('../controllers/tripController'); 
const {protect} = require('../middleware/auth');

router.route('/').get(protect, getTrips).post(protect, createTrip);
router.route('/:id').get(protect, getTripById).put(protect, updateTrip).delete(protect, deleteTrip);
router.post('/:id/expenses', protect, addExpense);
router.delete('/:id/expenses/:expenseId', protect, deleteExpense);

module.exports = router;