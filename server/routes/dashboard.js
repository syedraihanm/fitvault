const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const ctrl = require('../controllers/dashboardController');

router.get('/', protect, ctrl.getDashboard);

module.exports = router;
