const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const ctrl = require('../controllers/trackingController');

// Water
router.post('/water', protect, ctrl.logWater);
router.get('/water', protect, ctrl.getWaterLog);
router.get('/water/history', protect, ctrl.getWaterHistory);

// Steps
router.post('/steps', protect, ctrl.logSteps);
router.get('/steps', protect, ctrl.getStepLog);
router.get('/steps/history', protect, ctrl.getStepHistory);

// Goals
router.get('/goals', protect, ctrl.getGoals);
router.post('/goals', protect, ctrl.createGoal);
router.put('/goals/:id', protect, ctrl.updateGoal);
router.delete('/goals/:id', protect, ctrl.deleteGoal);

// Notifications
router.get('/notifications', protect, ctrl.getNotifications);
router.put('/notifications/:id/read', protect, ctrl.markRead);
router.put('/notifications/read-all', protect, ctrl.markAllRead);

module.exports = router;
