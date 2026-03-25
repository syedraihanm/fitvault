const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const ctrl = require('../controllers/progressController');

router.get('/', protect, ctrl.getLogs);
router.post('/', protect, ctrl.createLog);
router.delete('/:id', protect, ctrl.deleteLog);
router.get('/prs', protect, ctrl.getPRs);
router.get('/prs/:exerciseId', protect, ctrl.getExercisePR);

module.exports = router;
