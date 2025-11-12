const express = require('express');
const router = express.Router();
const { createBooking, getUserBookings, getAllBookings } = require('../controllers/bookingController');
const { protect, admin } = require('../middleware/auth');
const { 
  createBookingValidation, 
  mongoIdValidation,
  validate 
} = require('../middleware/validation');

router.post('/', protect, createBookingValidation, validate, createBooking);
router.get('/user/:id', protect, mongoIdValidation, validate, getUserBookings);
router.get('/', protect, admin, getAllBookings);

module.exports = router;
