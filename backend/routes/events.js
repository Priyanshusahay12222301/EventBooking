const express = require('express');
const router = express.Router();
const { getEvents, getEventById, createEvent, updateEvent, deleteEvent } = require('../controllers/eventController');
const { protect, admin } = require('../middleware/auth');
const { 
  createEventValidation, 
  updateEventValidation, 
  mongoIdValidation,
  validate 
} = require('../middleware/validation');

router.get('/', getEvents);
router.get('/:id', mongoIdValidation, validate, getEventById);
router.post('/', protect, createEventValidation, validate, createEvent);
router.put('/:id', protect, admin, updateEventValidation, validate, updateEvent);
router.delete('/:id', protect, admin, mongoIdValidation, validate, deleteEvent);

module.exports = router;
