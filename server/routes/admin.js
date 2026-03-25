const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/auth');
const ctrl = require('../controllers/adminController');

router.get('/users', protect, adminOnly, ctrl.getUsers);
router.get('/stats', protect, adminOnly, ctrl.getStats);
router.delete('/users/:id', protect, adminOnly, ctrl.deleteUser);
router.post('/exercises/bulk', protect, adminOnly, ctrl.bulkCreateExercises);
router.post('/foods/bulk', protect, adminOnly, ctrl.bulkCreateFoods);

module.exports = router;
