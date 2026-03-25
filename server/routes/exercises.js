const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const ctrl = require('../controllers/exerciseController');

router.get('/', protect, ctrl.getExercises);
router.get('/categories', protect, ctrl.getCategories);
router.post('/', protect, ctrl.createExercise);
router.put('/:id', protect, ctrl.updateExercise);
router.delete('/:id', protect, ctrl.deleteExercise);

module.exports = router;
