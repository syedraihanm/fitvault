const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/auth');
const ctrl = require('../controllers/programController');

router.get('/', protect, ctrl.getPrograms);
router.get('/my', protect, ctrl.getMyPrograms);
router.get('/:id', protect, ctrl.getProgram);
router.post('/:id/follow', protect, ctrl.toggleFollow);
router.post('/', protect, adminOnly, ctrl.createProgram);
router.put('/:id', protect, adminOnly, ctrl.updateProgram);
router.delete('/:id', protect, adminOnly, ctrl.deleteProgram);

module.exports = router;
