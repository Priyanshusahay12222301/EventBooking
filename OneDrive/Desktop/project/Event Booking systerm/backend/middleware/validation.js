const { body, param, validationResult } = require('express-validator');

// Validation error handler
exports.validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      success: false,
      message: 'Validation failed',
      errors: errors.array() 
    });
  }
  next();
};

// Auth validation rules
exports.registerValidation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters')
    .escape(),
  body('email')
    .trim()
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password must contain uppercase, lowercase, number, and special character')
];

exports.loginValidation = [
  body('email')
    .trim()
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

// Event validation rules
exports.createEventValidation = [
  body('title')
    .trim()
    .isLength({ min: 3, max: 200 })
    .withMessage('Title must be between 3 and 200 characters')
    .escape(),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Description must not exceed 2000 characters')
    .escape(),
  body('date')
    .notEmpty()
    .withMessage('Date is required'),
  body('time')
    .notEmpty()
    .withMessage('Time is required'),
  body('location')
    .trim()
    .isLength({ min: 2, max: 200 })
    .withMessage('Location must be between 2 and 200 characters')
    .escape(),
  body('price')
    .isFloat({ min: 0, max: 100000 })
    .withMessage('Price must be between 0 and 100,000'),
  body('totalSeats')
    .isInt({ min: 1, max: 100000 })
    .withMessage('Total seats must be between 1 and 100,000')
];

exports.updateEventValidation = [
  param('id')
    .isMongoId()
    .withMessage('Invalid event ID'),
  body('title')
    .optional()
    .trim()
    .isLength({ min: 3, max: 200 })
    .escape(),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .escape(),
  body('price')
    .optional()
    .isFloat({ min: 0, max: 100000 }),
  body('totalSeats')
    .optional()
    .isInt({ min: 1, max: 100000 })
];

// Booking validation rules
exports.createBookingValidation = [
  body('eventId')
    .notEmpty()
    .withMessage('Event ID is required')
    .isMongoId()
    .withMessage('Invalid event ID'),
  body('quantity')
    .isInt({ min: 1, max: 50 })
    .withMessage('Quantity must be between 1 and 50')
];

exports.mongoIdValidation = [
  param('id')
    .isMongoId()
    .withMessage('Invalid ID format')
];

module.exports = exports;
