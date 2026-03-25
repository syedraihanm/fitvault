const { validationResult, body } = require('express-validator');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  next();
};

const registerRules = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

const loginRules = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
];

const workoutSessionRules = [
  body('name').optional().trim(),
  body('startTime').notEmpty().withMessage('Start time is required'),
];

const mealLogRules = [
  body('mealType').isIn(['breakfast', 'lunch', 'dinner', 'snacks']).withMessage('Invalid meal type'),
  body('date').notEmpty().withMessage('Date is required'),
];

module.exports = { validate, registerRules, loginRules, workoutSessionRules, mealLogRules };
