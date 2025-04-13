// routes/insightsRoutes.js
const express = require('express');
const { getUserBehaviorInsights } = require('../controllers/insightsController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

// Route to get user behavior insights
router.get('/behavior-insights', authMiddleware, getUserBehaviorInsights);

module.exports = router;
