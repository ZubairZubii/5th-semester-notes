const express = require('express');
const {
  getSimilarMovies,
  getTrendingMovies,
  getTopRatedMovies,
  getRecommendationsForUser,
} = require('../controllers/recommendationController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/movie/:id/similar', getSimilarMovies); // Similar titles
router.get('/trending', getTrendingMovies); // Trending movies
router.get('/top-rated', getTopRatedMovies); // Top-rated movies
router.get('/user/recommendations', authMiddleware, getRecommendationsForUser); // Personalized recommendations

module.exports = router;
