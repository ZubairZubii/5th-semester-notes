// In adminRoutes.js
const express = require('express');
const { getPopularMovies, getTrendingGenres, getUserEngagement } = require('../controllers/analyticsController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

router.get('/popular-movies', authMiddleware, getPopularMovies);
router.get('/trending-genres', authMiddleware, getTrendingGenres);
router.get('/user-engagement', authMiddleware, getUserEngagement);

module.exports = router;
