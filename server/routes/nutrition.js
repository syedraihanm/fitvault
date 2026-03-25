const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { validate, mealLogRules } = require('../middleware/validate');
const ctrl = require('../controllers/nutritionController');

// Food items
router.get('/foods', protect, ctrl.getFoods);
router.post('/foods', protect, ctrl.createFood);
router.put('/foods/:id', protect, ctrl.updateFood);
router.delete('/foods/:id', protect, ctrl.deleteFood);

// Meal logs
router.get('/meals', protect, ctrl.getMealLogs);
router.get('/stats', protect, ctrl.getNutritionStats);
router.post('/meals', protect, mealLogRules, validate, ctrl.createMealLog);
router.put('/meals/:id', protect, ctrl.updateMealLog);
router.delete('/meals/:id', protect, ctrl.deleteMealLog);

module.exports = router;
