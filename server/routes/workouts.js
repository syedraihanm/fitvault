const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { validate, workoutSessionRules } = require('../middleware/validate');
const ctrl = require('../controllers/workoutController');

router.get('/', protect, ctrl.getSessions);
router.get('/stats', protect, ctrl.getStats);
router.get('/:id', protect, ctrl.getSession);
router.post('/', protect, workoutSessionRules, validate, ctrl.createSession);
router.put('/:id', protect, ctrl.updateSession);
router.delete('/:id', protect, ctrl.deleteSession);

module.exports = router;
