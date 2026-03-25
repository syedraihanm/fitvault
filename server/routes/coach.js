const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const ctrl = require('../controllers/coachController');

router.get('/suggestions', protect, ctrl.getSuggestions);

module.exports = router;
